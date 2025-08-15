import { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { adminGoogleLogin } from "../../service/AuthenService";
import Alert from "../ui/alert/Alert";

const clientId = "170897089182-ki6hqkt96pjabhg2tlqhk27csufvqhq4.apps.googleusercontent.com";

const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    setError(null);
    try {
      const data = await adminGoogleLogin(credential);
      if (data?.accessToken) {
        window.location.href = "/home";
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Backend login failed");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred, please try again.");
      }
    }
  };

  const handleError = () => {
    setError("Google login failed");
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg py-16 px-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
          Sign in with Google
        </h2>
        {error && (
          <div className="mb-4 w-full">
            <Alert
              variant="error"
              title="Sign in error"
              message={error}
            />
          </div>
        )}
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