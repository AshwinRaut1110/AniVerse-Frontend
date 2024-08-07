import { useSelector } from "react-redux";
import { DUMMY_STATS } from "../../util/dummy_data";
import DistributionChart from "../UI/DistributionChart";
import StatsRows from "./StatsRows";
import { useMemo } from "react";

const watchlistRowOneData = [
  {
    title: "Watching",
    value: DUMMY_STATS.watchlist.watching,
    color: "#FF6384",
  },
  {
    title: "Plan to Watch",
    value: DUMMY_STATS.watchlist.planToWatch,
    color: "#9966FF",
  },
  {
    title: "Dropped",
    value: DUMMY_STATS.watchlist.dropped,
    color: "#4BC0C0",
  },
  {
    title: "Completed",
    value: DUMMY_STATS.watchlist.completed,
    color: "#FFCE56",
  },
  {
    title: "On Hold",
    value: DUMMY_STATS.watchlist.onHold,
    color: "#36A2EB",
  },
];

const userStatsRowOne = [
  {
    title: "Helpful Votes",
    value: DUMMY_STATS.helpfulVotesReceived,
    color: "#10D03C",
  },
  {
    title: "Not Helpful Votes",
    value: DUMMY_STATS.notHelpfulVotesReceived,
    color: "#DC3545",
  },
];

const userStatsRowTwo = [
  {
    title: "Reviews Given",
    value: DUMMY_STATS.reviewsCount,
  },
  {
    title: "Comments Made",
    value: DUMMY_STATS.commentsCount,
  },
];

function AnimeStats() {
  const { username, createdAt } = useSelector((state) => state.auth.user);

  const watchlistRowTwoData = useMemo(() => {
    const totalWatched = watchlistRowOneData.reduce(
      (currSum, { value }) => currSum + value,
      0
    );

    return [
      {
        title: "Total Entries",
        value: totalWatched,
      },
      {
        title: "Episodes Watched",
        value: DUMMY_STATS.episodesWatched,
      },
    ];
  }, [watchlistRowOneData]);

  return (
    <div className="flex flex-col sm:flex-row flex-grow w-full sm:justify-around space-y-10 sm:space-y-0">
      {/* user stats */}
      <div className="max-w-[100%] sm:max-w-[50%] space-y-4">
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
          data={userStatsRowOne}
          className="w-[300px] sm:w-[400px] md:w-[500px] h-[50px]"
        />

        {/* stat rows */}
        <StatsRows rowOneData={userStatsRowOne} rowTwoData={userStatsRowTwo} />
      </div>

      {/* watchlist stats */}
      <div className="max-w-[100%] sm:max-w-[50%] space-y-4">
        <h2 className="text-white text-sm sm:text-lg md:text-xl lg:text-3xl font-[Lato] font-semibold">
          WatchList &nbsp;Statistics
        </h2>
        <div className="flex justify-between items-center text-white text-[0.7rem] sm:text-sm font-semibold font-[Lato]">
          <p>
            <span className="text-[#a3a3a3]">Total Watch Time: </span>
            {DUMMY_STATS.totalWatchTime} Hrs
          </p>
          <p>
            <span className="text-[#a3a3a3]">Mean Rating: </span>
            {DUMMY_STATS.meanRating}
          </p>
        </div>
        <DistributionChart
          data={watchlistRowOneData}
          className="w-[300px] sm:w-[400px] md:w-[500px] h-[50px]"
        />

        {/* stat rows */}
        <StatsRows
          rowOneData={watchlistRowOneData}
          rowTwoData={watchlistRowTwoData}
        />
      </div>
    </div>
  );
}

export default AnimeStats;
