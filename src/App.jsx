import { useLocation, useNavigate } from "react-router-dom";
import history from "./util/history";

function App() {
  // initialize the history object so navigate and location can be used outside components
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className=" bg-primary-color h-[100vh]">
      <header className="w-full h-[75px] bg-secondary-color"></header>
    </div>
  );
}

export default App;
