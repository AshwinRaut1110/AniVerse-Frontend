function WatchListRows({ rowOneData, rowTwoData }) {
  return (
    <div className="w-full flex space-x-10">
      {/* watched, onhold, plantowatch etc distribution */}
      <div className="w-[50%] space-y-3">
        {rowOneData.map(({ title, color, value }) => (
          <div className="flex items-center space-x-2" key={title}>
            <div
              className={`w-2 sm:w-4 h-2 sm:h-4 rounded-full`}
              style={{ backgroundColor: color }}
            />
            <p className="flex-grow text-[#abc4ed] text-[0.65rem] sm:text-sm text-sm font-[Lato]">
              {title}
            </p>
            <p className="text-[#e0e0e0] text-[0.65rem] sm:text-sm font-[Lato]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* extra info */}
      <div className="w-[50%] space-y-3">
        {rowTwoData.map(({ title, value }) => (
          <div className="flex items-center space-x-2" key={title}>
            <p className="flex-grow text-[#a3a3a3] text-[0.65rem] sm:text-sm font-[Lato]">
              {title}
            </p>
            <p className="text-[#e0e0e0] text-[0.65rem] sm:text-sm font-[Lato]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WatchListRows;
