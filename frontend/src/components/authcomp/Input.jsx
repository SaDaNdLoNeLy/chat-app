export default function Input(props) {
  const { label, type, name, setValue, value } = props
  const handleChangeInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-col py-2">
      <label className="text-xs text-gray-400">{label}</label>
      <input
        className="rounded-lg text-gray-200 bg-gray-700 mt-2 p-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-sm"
        type={type}
        name={name}
        value={value}
        onChange={handleChangeInput}
      />
    </div>
  );
}
