import { useEffect, useState } from "react";
import senko from "../../assets/login.png";
import Input from "../UI/Inputs/Input";
import { useDispatch, useSelector } from "react-redux";
import { authModalActions } from "../../store/authModalSlice";
import { authActions } from "../../store/authSlice";
import ErrorComponent from "../UI/ErrorComponent";
import nyanLoader from "../../assets/nyan-loader.gif";

const isEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  emailOrUsername: "",
};

function Auth() {
  // auth page state
  const { currentPage } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();

  // authed user state
  const user = useSelector((state) => state.auth);

  // user input state
  const [userAuthData, setUserAuthData] = useState({ ...initialState });

  // handlers
  const handleInputChange = (inputField, value) => {
    setUserAuthData((prevValue) => ({ ...prevValue, [inputField]: value }));
  };

  const handleAuthentication = (e) => {
    e.preventDefault();

    const userData = {};

    // creating the userData object based on wether we are logging in or signing up
    if (currentPage === "login") {
      if (isEmail(userAuthData.emailOrUsername)) {
        userData.email = userAuthData.emailOrUsername;
      } else {
        userData.username = userAuthData.emailOrUsername;
      }

      userData.password = userAuthData.password;
    } else {
      userData.email = userAuthData.email;
      userData.username = userAuthData.username;
      userData.password = userAuthData.password;
      userData.confirmPassword = userAuthData.confirmPassword;
    }

    setUserAuthData({ ...initialState });

    dispatch(authActions.authenticate({ mode: currentPage, userData }));
  };

  const handleHideError = () => {
    // reset the auth state which is unmount the error
    dispatch(authActions.resetAuthState());
  };

  useEffect(() => {
    if (user.user) {
      // when the user successfully logs in or is already logged in then close the modal
      dispatch(authModalActions.hideModal());
    }
  }, [user]);

  const handleSwitchPages = () => {
    dispatch(
      authModalActions.changeCurrentPage(
        currentPage === "login" ? "signup" : "login"
      )
    );
  };

  return (
    <div className="flex bg-secondary-color p-5 font-[Lato] md:max-w-4xl rounded-lg">
      {/* form div */}
      <div className="flex-grow">
        <h4 className="text-4xl text-white font-bold">
          {currentPage === "login" ? "Log In" : "Sign Up"}
        </h4>
        <p className="text-white text-sm mt-2 mb-4">
          {currentPage === "login"
            ? "Welcome back, nice to see you again"
            : "Register to dicover an amazing anime community"}
        </p>

        {user.error && (
          <ErrorComponent onHideError={handleHideError} errors={user.error} />
        )}

        <form className="space-y-5" onSubmit={handleAuthentication}>
          {currentPage === "signup" && (
            <>
              <Input
                id="username"
                label="Username"
                type="text"
                value={userAuthData.username}
                className="w-full"
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />

              <Input
                id="email"
                label="Email"
                type="email"
                value={userAuthData.email}
                className="w-full"
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </>
          )}

          {currentPage === "login" && (
            <Input
              id="emailOrUsername"
              label="Username or email"
              type="text"
              value={userAuthData.emailOrUsername}
              className="w-full"
              onChange={(e) => handleInputChange(e.target.id, e.target.value)}
            />
          )}

          <Input
            id="password"
            label="Password"
            type="password"
            value={userAuthData.password}
            className="w-full"
            onChange={(e) => handleInputChange(e.target.id, e.target.value)}
          />

          {currentPage === "signup" && (
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={userAuthData.confirmPassword}
              className="w-full"
              onChange={(e) => handleInputChange(e.target.id, e.target.value)}
            />
          )}

          <div className="flex w-full items-end justify-end">
            {user.loading && (
              <img
                src={nyanLoader}
                alt="nyan loader animation"
                className="h-14"
              />
            )}

            {!user.loading && (
              <button className="bg-white px-10 sm:px-16 py-3 sm:py-5 text-lg rounded-full active:scale-95">
                {currentPage === "login" ? "Log In" : "Sign Up"}
              </button>
            )}
          </div>

          <p
            className="text-white text-center cursor-pointer"
            onClick={handleSwitchPages}
          >
            {currentPage === "login"
              ? "New here? register for an accounnt"
              : "Already have an account? Log In"}
          </p>
        </form>
      </div>

      {/* image div */}
      <div
        className={`items-center justify-center w-[50%] h-[50%] hidden md:flex pl-10 ${
          currentPage === "signup" ? "pt-20" : ""
        }`}
      >
        <img src={senko} alt="senko" className="w-[100%] h-[100%]" />
      </div>
    </div>
  );
}

export default Auth;
