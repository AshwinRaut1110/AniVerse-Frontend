import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/browse", {
      state: {
        title: "attack on",
      },
    });
  };

  return (
    <div className="min-h-[100rem] w-full">
      <button onClick={handleNavigate} className="text-white">
        Go to Browse
      </button>
    </div>
  );
}

export default HomePage;
