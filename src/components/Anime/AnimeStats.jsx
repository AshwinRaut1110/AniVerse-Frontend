import { useSelector } from "react-redux";
import { DUMMY_STATS } from "../../util/dummy_data";
import DistributionChart from "../UI/DistributionChart";
import StatsRows from "./StatsRows";
import { useMemo } from "react";
import { returnUserStats, returnWatchlistStats } from "../../util/misc";

function AnimeStats() {
  const { username, createdAt, stats } = useSelector(
    (state) => state.auth.user
  );

  const { userStatsColOne, userStatsColTwo } = useMemo(
    () => returnUserStats(stats),
    [stats, returnUserStats]
  );

  const { watchlistStatsColOne, watchlistStatsColTwo } = useMemo(
    () => returnWatchlistStats(stats.watchlistStats),
    [stats.watchlistStats, returnWatchlistStats]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* user stats */}
      <div className="rounded-lg bg-[#191919] shadow-md p-5 max-w-[100%]  space-y-4">
        <h2 className="text-white text-sm sm:text-lg md:text-xl lg:text-3xl font-[Lato] font-semibold">
          {username}'s &nbsp;Statistics
        </h2>
        <div className="flex justify-between items-center text-white text-[0.7rem] sm:text-sm  font-semibold font-[Lato]">
          <p>
            <span className="text-[#a3a3a3]">Member Since: </span>
            {new Date(createdAt).toLocaleDateString("en-IN", {
              month: "long",
              day: "2-digit",
              year: "numeric",
              weekday: "long",
            })}
          </p>
        </div>

        <DistributionChart
          data={userStatsColOne}
          placeHolderText="Interact With The Community To See Your Stats."
          className="w-full h-[50px]"
        />

        {/* stat rows */}
        <StatsRows rowOneData={userStatsColOne} rowTwoData={userStatsColTwo} />
      </div>

      {/* watchlist stats */}
      <div className="rounded-lg bg-[#191919] shadow-md p-5 max-w-[100%] space-y-4">
        <h2 className="text-white text-sm sm:text-lg md:text-xl lg:text-3xl font-[Lato] font-semibold">
          WatchList &nbsp;Statistics
        </h2>
        <div className="flex justify-between items-center text-white text-[0.7rem] sm:text-sm font-semibold font-[Lato]">
          <p>
            <span className="text-[#a3a3a3]">Total Watch Time: </span>
            {DUMMY_STATS.totalWatchTime} Hrs
          </p>
        </div>
        <DistributionChart
          data={watchlistStatsColOne}
          placeHolderText="Add Some Animes To Your Watchlist To See Your Stats."
          className="w-full h-[50px]"
        />

        {/* stat rows */}
        <StatsRows
          rowOneData={watchlistStatsColOne}
          rowTwoData={watchlistStatsColTwo}
        />
      </div>
    </div>
  );
}

export default AnimeStats;
