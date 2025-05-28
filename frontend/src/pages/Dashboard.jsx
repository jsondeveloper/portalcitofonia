import { useEffect, useState } from 'react';
import { getExtensions, updateExtensions, writeConf } from '../api/api';
import ExtensionEditor from '../components/ExtensionEditor';

export default function Dashboard() {
  const [extensions, setExtensions] = useState([]);

  useEffect(() => {
    getExtensions().then(res => setExtensions(res.data));
  }, []);

  const handleSave = async () => {
    await updateExtensions({ extensions });
    alert('Guardado con éxito');
  };

  const handlePublish = async () => {
    await writeConf();
    alert('Archivo .conf actualizado');
  };

  return (
    <div>
      <h2>Panel de extensiones</h2>
      <ExtensionEditor extensions={extensions} setExtensions={setExtensions} />
      <button onClick={handleSave}>Guardar</button>
      <button onClick={handlePublish}>Publicar .conf</button>
    </div>
  );
}
