import React from "react";
import { useSelector } from "react-redux";
import Auth from "./Auth";

function AuthModal() {
  const { currentPage } = useSelector((state) => state.authModal);

  return <>{["signup", "login"].includes(currentPage) && <Auth />}</>;
}

export default AuthModal;
