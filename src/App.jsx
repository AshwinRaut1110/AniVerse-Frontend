import { Outlet, useLocation, useNavigate } from "react-router-dom";
import history from "./util/history";
import { useDispatch, useSelector } from "react-redux";
import MainNavigation from "./components/MainNavigation";
import Modal from "./components/UI/Modal";
import AuthModal from "./components/Auth/AuthModal";
import { authModalActions } from "./store/authModalSlice";

function App() {
  // initialize the history object so navigate and location can be used outside components
  history.navigate = useNavigate();
  history.location = useLocation();

  const { modalIsShown } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();

  const handleHideModal = () => {
    dispatch(authModalActions.hideModal());
  };

  // const handleClick = () => {
  //   dispatch(
  //     authActions.authenticate({
  //       mode: "login",
  //       userData: { username: "AshwinRaut1110", password: "Random@123" },
  //     })
  //   );
  // };

  // const dispatch = useDispatch();

  return (
    <div className="bg-primary-color h-[100vh]">
      <MainNavigation />
      <Outlet />
      <Modal isOpen={modalIsShown} onClose={handleHideModal}>
        <AuthModal />
      </Modal>
    </div>
  );
}

export default App;
