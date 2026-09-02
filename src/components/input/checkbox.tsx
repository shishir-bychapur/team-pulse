export default function CheckBox({
  id,
  filter,
  callback,
}: {
  id: string;
  callback: (isChecked: boolean, id: string) => void;
  filter: string[];
}) {
  const handler = () => {
    callback(filter.includes(id), id);
  };

  return (
    <input
      id={id}
      type="checkbox"
      className="size-5 rounded border-gray-300 shadow-sm cursor-pointer"
      checked={filter.includes(id)}
      onChange={handler}
    />
  );
}
