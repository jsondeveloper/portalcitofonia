export default function ExtensionEditor({ extensions, setExtensions }) {
  const updateExtension = (idx, key, val) => {
    const copy = [...extensions];
    copy[idx][key] = val;
    setExtensions(copy);
  };

  const addNumber = (idx) => {
    const copy = [...extensions];
    copy[idx].numbers.push({ priority: copy[idx].numbers.length + 1, number: '', options: '' });
    setExtensions(copy);
  };

  return (
    <div>
      {extensions.map((ext, i) => (
        <div key={i}>
          <h4>{ext.extension_number}</h4>
          {ext.numbers.map((n, j) => (
            <div key={j}>
              <input
                value={n.priority}
                onChange={e => {
                  const copy = [...extensions];
                  copy[i].numbers[j].priority = e.target.value;
                  setExtensions(copy);
                }}
              />
              <input
                value={n.number}
                onChange={e => {
                  const copy = [...extensions];
                  copy[i].numbers[j].number = e.target.value;
                  setExtensions(copy);
                }}
              />
              <input
                value={n.options}
                onChange={e => {
                  const copy = [...extensions];
                  copy[i].numbers[j].options = e.target.value;
                  setExtensions(copy);
                }}
              />
            </div>
          ))}
          <button onClick={() => addNumber(i)}>+ Añadir número</button>
        </div>
      ))}
    </div>
  );
}
