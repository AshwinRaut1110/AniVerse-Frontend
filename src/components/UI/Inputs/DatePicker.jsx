import React, { useState, useEffect, useRef } from "react";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

const DatePicker = ({ placeholder, onDateChanged }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const calendarRef = useRef(null);
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const handleDateClick = (date) => {
    const newSelectedDate = currentDate.date(date);
    setSelectedDate(newSelectedDate.format("YYYY-MM-DD"));
    setShowCalendar(false);
    onDateChanged(newSelectedDate.format("YYYY-MM-DD"));
  };

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));

  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleYearClick = () => setShowYearDropdown(!showYearDropdown);

  const handleYearSelect = (year) => {
    setCurrentDate(currentDate.year(year));
    setShowYearDropdown(false);
  };

  const renderDays = () => {
    const daysInMonth = currentDate.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => (
      <div
        key={i + 1}
        className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${
          selectedDate === currentDate.date(i + 1).format("YYYY-MM-DD")
            ? "bg-primary-blue text-white"
            : "bg-primary-color text-gray-300"
        } hover:bg-hover-blue`}
        onClick={() => handleDateClick(i + 1)}
      >
        {i + 1}
      </div>
    ));
  };

  const renderYearDropdown = () => {
    const startYear = currentDate.year() - 10;
    const endYear = currentDate.year() + 10;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => (
      <div
        key={startYear + i}
        className="py-1 px-3 hover:bg-hover-blue cursor-pointer text-white"
        onClick={() => handleYearSelect(startYear + i)}
      >
        {startYear + i}
      </div>
    ));
  };

  return (
    <div ref={calendarRef} className="relative">
      <div
        className="flex items-center bg-secondary-color p-3 rounded-md cursor-pointer min-w-80 lg:min-w-96"
        onClick={toggleCalendar}
      >
        <input
          type="text"
          value={selectedDate ? `${selectedDate}` : ""}
          placeholder={placeholder}
          readOnly
          className="bg-transparent text-white border-none outline-none w-full placeholder-gray-400"
        />
        <CalendarDaysIcon className="w-5 h-5 text-primary-blue" />
      </div>
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-14 bg-secondary-color border border-primary-color rounded-md p-3 min-w-80 lg:min-w-96 z-50"
        >
          <div className="flex justify-between items-center mb-3">
            <ChevronLeftIcon
              className="w-5 h-5 text-primary-blue cursor-pointer"
              onClick={handlePrevMonth}
            />
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleYearClick}
            >
              <span className="text-white font-semibold">
                {currentDate.format("MMMM YYYY")}
              </span>
              {showYearDropdown ? (
                <ChevronUpIcon className="w-5 h-5 text-primary-blue" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-primary-blue" />
              )}
            </div>
            <ChevronRightIcon
              className="w-5 h-5 text-primary-blue cursor-pointer"
              onClick={handleNextMonth}
            />
          </div>
          {showYearDropdown && (
            <div
              ref={yearDropdownRef}
              className="bg-secondary-color border border-primary-color rounded-md shadow-lg absolute top-1 mt-1 w-full max-h-32 thin-scroll overflow-y-scroll"
            >
              {renderYearDropdown()}
            </div>
          )}
          <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
