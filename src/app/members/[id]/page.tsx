export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Member Page</h1>
      <p>Member ID: {id}</p>
    </div>
  );
}
