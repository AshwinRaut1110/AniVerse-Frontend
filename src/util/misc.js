export function capitalize(s) {
  return s[0].toUpperCase() + s.substring(1);
}

export function formatAiredDate(value) {
  let formattedDateString = "";

  const date = new Date(value);

  const day = date.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });

  const year = date.toLocaleDateString("en-US", {
    year: "numeric",
  });

  formattedDateString = `${day} ${month}, ${year}`;

  return formattedDateString;
}

export function applyWordLimit(text, wordLimit) {
  const textArray = text.split(" ");
  const wordLimitedText = textArray.slice(0, wordLimit).join(" ");

  return wordLimitedText + (textArray.length > wordLimit ? "..." : "");
}

export function applyCharacterLimit(text, charLimit) {
  return text.substring(0, charLimit) + (text.length > charLimit ? "..." : "");
}

export function getScreenDimensions() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 640) {
    return "xs";
  } else if (screenWidth >= 640 && screenWidth < 768) {
    return "sm";
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return "md";
  } else if (screenWidth >= 1024 && screenWidth < 1280) {
    return "lg";
  } else {
    return "xl";
  }
}

export function hasMinLength(s, minLength) {
  return s.trim().length >= minLength;
}

export function getPageOptions(totalEpisodes, episodesPerPage) {
  const tempEpisodesCount = totalEpisodes - (totalEpisodes % episodesPerPage);

  const options = [];

  let i = 1,
    pageCount = 1;
  while (i <= tempEpisodesCount) {
    const rangeStart = i >= 1000 ? i : i.toString().padStart(3, "0");
    const end = i + episodesPerPage - 1;
    const rangeEnd = end >= 1000 ? end : end.toString().padStart(3, "0");

    options.push({
      title: `${rangeStart} - ${rangeEnd}`,
      page: pageCount,
    });

    i += episodesPerPage;
    pageCount++;
  }

  if (totalEpisodes % episodesPerPage > 0) {
    const rangeStart = i >= 1000 ? i : i.toString().padStart(3, "0");
    const rangeEnd =
      totalEpisodes >= 1000
        ? totalEpisodes
        : totalEpisodes.toString().padStart(3, "0");

    options.push({
      title: `${rangeStart} - ${rangeEnd}`,
      page: pageCount,
    });
  }

  return options;
}

const titles = [
  "Appalling",
  "Horrible",
  "Very Bad",
  "Bad",
  "Average",
  "Fine",
  "Good",
  "Very Good",
  "Great",
  "Masterpiece",
];

export function getTitleFromRating(rating) {
  return titles[Number.parseInt(rating * 2) - 1];
}

export function timeAgo(dateString) {
  const secondsAgo = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const amount = Math.floor(secondsAgo / seconds);
    if (amount >= 1) {
      return `${amount} ${label}${amount > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function returnUserStats(stats) {
  {
    return {
      userStatsColOne: [
        {
          title: "Helpful Votes",
          value: stats.helpfulVotes,
          color: "#10D03C",
        },
        {
          title: "Not Helpful Votes",
          value: stats.notHelpfulVotes,
          color: "#DC3545",
        },
      ],
      userStatsColTwo: [
        {
          title: "Reviews Given",
          value: stats.reviewsGiven,
        },
        {
          title: "Comments Made",
          value: stats.commentsMade,
        },
      ],
    };
  }
}

export function returnWatchlistStats(watchlistStats) {
  const listStats = {
    watchlistStatsColOne: [
      {
        title: "Watching",
        value: watchlistStats.watching,
        color: "#FF6384",
      },
      {
        title: "Plan to Watch",
        value: watchlistStats.planToWatch,
        color: "#9966FF",
      },
      {
        title: "Dropped",
        value: watchlistStats.dropped,
        color: "#4BC0C0",
      },
      {
        title: "Completed",
        value: watchlistStats.completed,
        color: "#FFCE56",
      },
      {
        title: "On Hold",
        value: watchlistStats.onHold,
        color: "#36A2EB",
      },
    ],
  };

  const totalWatched = listStats.watchlistStatsColOne.reduce(
    (currSum, { value }) => currSum + value,
    0
  );

  listStats["watchlistStatsColTwo"] = [
    {
      title: "Total Entries",
      value: totalWatched,
    },
    {
      title: "Episodes Watched",
      value: watchlistStats.episodesWatched,
    },
  ];

  return listStats;
}
