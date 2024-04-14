import React from "react";
import { useSelector } from "react-redux";
import Auth from "./Auth";

function AuthModal() {
  const { currentPage, modalIsShown } = useSelector((state) => state.authModal);

  return (
    <>{["signup", "login"].includes(currentPage) && modalIsShown && <Auth />}</>
  );
}

export default AuthModal;
