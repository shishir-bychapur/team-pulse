const Card = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="max-w-sm rounded p-2 mx-2 border border-gray-300 shadow-lg"
      onClick={onClick}
    >
      <div className="font-bold text-xl mb-2">{title}</div>
      <p className="text-gray-700 text-base">{description}</p>
    </div>
  );
};

export default Card;
