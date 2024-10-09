import React from "react";
import Options from "../components/ProfilePageComponents/Options";
import ManageAnimesSection from "../components/ManageSite/ManageAnimesSection";
import ManageEpisodesSection from "../components/ManageSite/ManageEpisodesSection";
import ManageHomePageSection from "../components/ManageSite/ManageHomePageSection";

function ManagePage() {
  return (
    <div className="w-full h-full px-3 md:px-4 pb-14">
      <Options
        TABS={[
          {
            title: "Manage Animes",
            id: "manageAnimes",
            component: <ManageAnimesSection />,
          },
          {
            title: "Manage Episodes",
            id: "manageEpisodes",
            component: <ManageEpisodesSection />,
          },
          {
            title: "Manage Home Page",
            id: "manageHomePage",
            component: <ManageHomePageSection />,
          },
        ]}
        numberOfTabs={3}
      />
    </div>
  );
}

export default ManagePage;
