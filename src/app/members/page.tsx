import Card from "@/src/components/card";

const Members = () => {
  const data = [
    { title: "Member 1", description: "Member Description 1" },
    { title: "Member 2", description: "Member Description 2" },
    { title: "Member 3", description: "Member Description 3" },
    { title: "Member 4", description: "Member Description 4" },
    { title: "Member 5", description: "Member Description 5" },
  ];

  return (
    <div>
      <h1 className="mx-2 max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Members
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((member, index) => (
          <Card
            key={index}
            title={member.title}
            description={member.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Members;
