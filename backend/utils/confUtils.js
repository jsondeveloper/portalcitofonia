const { Client } = require('ssh2');
const fs = require('fs');
const os = require('os');
const mysql = require('mysql2/promise');

async function readRemoteFile({ host, username, privateKeyPath, remotePath }) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

        conn
            .on('ready', () => {
                conn.sftp((err, sftp) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    let chunks = [];
                    const stream = sftp.createReadStream(remotePath);

                    stream.on('data', chunk => chunks.push(chunk));
                    stream.on('end', () => {
                        const content = Buffer.concat(chunks).toString('utf8');
                        conn.end();
                        resolve(content);
                    });
                    stream.on('error', err => {
                        conn.end();
                        reject(err);
                    });
                });
            })
            .connect({
                host,
                username,
                privateKey,
            });
    });
}

async function syncFromFile() {
    const host = process.env.SSH_HOST;
    const username = process.env.SSH_USER;
    const privateKeyPath = process.env.SSH_KEY_PATH.replace('~', os.homedir());
    const remotePath = '/etc/asterisk/extensions.conf';

    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    };

    const content = await readRemoteFile({ host, username, privateKeyPath, remotePath });

    console.log('📄 Archivo extensions.conf:\n', content);

    const lines = content.split('\n').map(line => line.trim());
    const config = {};
    let currentContext = null;
    const allowedContexts = ['salitreclub', 'poloclub'];

    // Paso 1: Agrupar líneas por contexto
    for (const line of lines) {
        if (!line || line.startsWith(';')) continue;

        if (line.startsWith('[') && line.endsWith(']')) {
            currentContext = line.slice(1, -1);
        } else if (currentContext && allowedContexts.includes(currentContext)) {
            if (!config[currentContext]) config[currentContext] = [];
            config[currentContext].push(line);
        }
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.query('DELETE FROM asterisk_extensions');

        // Paso 2: Procesar cada contexto por separado
        for (const [context, lines] of Object.entries(config)) {
            const extensionMap = {};

            for (const line of lines) {
                const match = line.match(/^exten\s*=>\s*(\d+),(\d+|n),dial\(\s*([^)]+)\)/i);
                if (match) {
                    const ext = match[1];
                    const dialContent = match[3]; // ahora está en la posición 3

                    const firstCommaIndex = dialContent.indexOf(',');
                    const channel = firstCommaIndex === -1 ? dialContent.trim() : dialContent.substring(0, firstCommaIndex).trim();

                    const parts = channel.split('/').filter(Boolean);
                    const number = parts.length > 0 ? parts[parts.length - 1] : null;

                    if (number) {
                        if (!extensionMap[ext]) extensionMap[ext] = [];
                        if (extensionMap[ext].length < 5) {
                            extensionMap[ext].push(number);
                        }
                    }
                }
            }




            for (const [ext, numbers] of Object.entries(extensionMap)) {
                const padded = [...numbers, ...Array(5 - numbers.length).fill('0')];
                console.log(`📥 Insertando: ${context} - ${ext} - ${padded.join(', ')}`);

                await connection.query(
                    `INSERT INTO asterisk_extensions (
                context, extension, posicion1, posicion2, posicion3, posicion4, posicion5
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [context, ext, ...padded]
                );
            }
        }



        console.log('✅ Extensiones sincronizadas correctamente');
    } catch (err) {
        console.error('❌ Error guardando en DB:', err);
    } finally {
        await connection.end();
    }
}


module.exports = {
    syncFromFile,
};
