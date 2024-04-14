import { useState } from "react";
import senko from "../../assets/login.png";
import Input from "../UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { authModalActions } from "../../store/authModalSlice";

function Auth() {
  const { currentPage } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();

  const [userAuthData, setUserAuthData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailOrUsername: "",
  });

  const handleInputChange = (inputField, value) => {
    setUserAuthData((prevValue) => ({ ...prevValue, [inputField]: value }));
  };

  const handleAuthentication = (e) => {
    e.preventDefault();
  };

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

        <form className="space-y-5" onSubmit={handleAuthentication}>
          {currentPage === "signup" && (
            <>
              <Input
                id="username"
                label="Username"
                value={userAuthData.username}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />

              <Input
                id="email"
                label="Email"
                value={userAuthData.email}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </>
          )}

          {currentPage === "login" && (
            <Input
              id="emailOrUsername"
              label="Username or email"
              value={userAuthData.emailOrUsername}
              onChange={(e) => handleInputChange(e.target.id, e.target.value)}
            />
          )}

          <Input
            id="password"
            label="Password"
            value={userAuthData.password}
            onChange={(e) => handleInputChange(e.target.id, e.target.value)}
          />

          {currentPage === "signup" && (
            <Input
              id="confirmPassword"
              label="Confirm Password"
              value={userAuthData.confirmPassword}
              onChange={(e) => handleInputChange(e.target.id, e.target.value)}
            />
          )}

          <div className="flex w-full items-end justify-end">
            <button className="bg-white px-10 sm:px-16 py-3 sm:py-5 text-lg rounded-full active:scale-95">
              {currentPage === "login" ? "Log In" : "Sign Up"}
            </button>
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
