import Sidebar from "@/components/general/sidebar";

const page = () => {
  return (
    <div className="flex w-full">
      <Sidebar></Sidebar>
      <div className="bg-red-100 w-full"></div>
    </div>
  );
};

export default page;
