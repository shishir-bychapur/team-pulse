export default function Alert({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 m-2 p-4 rounded relative"
      role="alert"
    >
      <strong className="font-bold">{title}</strong>
      <span className="mx-2 block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
      </span>
    </div>
  );
}
