import Router from "next/router";
import { useState, useEffect } from "react";
import { googleLogin, authenticate, isAuth } from "../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../config";
import GoogleLogin from "react-google-login";

const LoginGoogle = () => {
  const responseGoogle = (response) => {
    const tokenId = response.tokenId;
    const user = { tokenId };
    googleLogin(user).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push("/admin");
          } else {
            Router.push("/user");
          }
        });
      }
    });
  };

  return (
    <div className="pb-3 text-center">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
};

export default LoginGoogle;
