const Button = ({
  children,
  onClick,
  id,
}: {
  children: React.ReactNode;
  onClick: () => void;
  id: string;
}) => {
  return (
    <button
      id={id}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
