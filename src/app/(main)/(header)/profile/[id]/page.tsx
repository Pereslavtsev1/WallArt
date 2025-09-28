export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div>
      <div>{id}</div>
    </div>
  );
}
