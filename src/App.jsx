import { useLocation, useNavigate } from "react-router-dom";
import history from "./util/history";
import { useDispatch } from "react-redux";
import { authActions } from "./store/authSlice";

function App() {
  // initialize the history object so navigate and location can be used outside components
  history.navigate = useNavigate();
  history.location = useLocation();

  const handleClick = () => {
    dispatch(
      authActions.authenticate({
        mode: "login",
        userData: { username: "AshwinRaut111", password: "Random@123" },
      })
    );
  };

  const dispatch = useDispatch();

  return (
    <div className=" bg-primary-color h-[100vh]">
      <header className="w-full h-[75px] bg-secondary-color"></header>
      <button className="text-white" onClick={handleClick}>
        click me
      </button>
    </div>
  );
}

export default App;
