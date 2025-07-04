import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "170897089182-ki6hqkt96pjabhg2tlqhk27csufvqhq4.apps.googleusercontent.com";

const SignInForm = () => {
  const handleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    try {
      const res = await fetch("https://localhost:7166/api/GoogleLogin/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/";
      } else {
        console.error("Backend login failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg py-16 px-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
          Đăng nhập bằng Google
        </h2>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            width="100%"
            shape="rectangular"
            text="signin_with"
            theme="filled_blue"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SignInForm;