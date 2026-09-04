const Input = ({
  id,
  type,
  label,
  value,
  onChange,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-gray-700"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-10"
        id={id}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
