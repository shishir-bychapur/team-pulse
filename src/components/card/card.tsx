const Card = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => {
  const initial = title.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {initial}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5.25 15.75 12 9 18.75"
          />
        </svg>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {description}
        </span>
      </div>
    </button>
  );
};

export default Card;
