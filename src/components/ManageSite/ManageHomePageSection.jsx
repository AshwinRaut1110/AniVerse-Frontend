import AddSection from "./ManageHomePageComponents/AddSection";
import Sections from "./ManageHomePageComponents/Sections";

function ManageHomePageSection() {
  return (
    <div className="px-5 py-7">
      <AddSection />

      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-[Lato] text-[#DDDDDD] my-10">
        Home Page Sections
      </h3>

      <Sections />
    </div>
  );
}

export default ManageHomePageSection;
