import { Outlet, useLocation, useNavigate } from "react-router-dom";
import history from "./util/history";
import { useDispatch, useSelector } from "react-redux";
import MainNavigation from "./components/MainNavigation";
import Modal from "./components/UI/Modal";
import AuthModal from "./components/Auth/AuthModal";
import { authModalActions } from "./store/authModalSlice";
import SuccessNotification from "./components/UI/Notifications/SuccessNotification";
import ErrorNotification from "./components/UI/Notifications/ErrorNotification";

function App() {
  // initialize the history object so navigate and location can be used outside components
  history.navigate = useNavigate();
  history.location = useLocation();

  const { modalIsShown } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();

  const successNotification = useSelector(
    (state) => state.notification.success
  );

  const errorNotification = useSelector((state) => state.notification.error);

  // hides the login modal
  const handleHideModal = () => {
    dispatch(authModalActions.hideModal());
  };

  return (
    <div className="bg-primary-color min-h-screen relative">
      {successNotification.show && (
        <SuccessNotification message={successNotification.message} />
      )}

      {errorNotification.show && (
        <ErrorNotification message={errorNotification.message} />
      )}
      
      <MainNavigation />
      <Outlet />
      <Modal isOpen={modalIsShown} onClose={handleHideModal}>
        <AuthModal />
      </Modal>
    </div>
  );
}

export default App;
