import { notFound } from "next/navigation";
const page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { id } = params;
  return <div>page</div>;
};

export default page;
