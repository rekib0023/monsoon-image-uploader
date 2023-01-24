import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import useToggle from "../hooks/useToggle";
import InputField from "../components/InputField";
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth } = useAuth();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [check, toggleCheck] = useToggle("persist", true);
  const [errMsg, setErrMsg] = useState("");

  const [_, setpersistRefreshToken] = useLocalStorage("refreshToken", "");

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email: email,
          password: password,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;
      if (check) {
        setpersistRefreshToken(refreshToken);
      } else {
        setpersistRefreshToken("");
      }
      setAuth({ email, accessToken, refreshToken });
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error.response);
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.data) {
        setErrMsg(Object.values(error.response.data)[0]);
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 block p-6 bg-white  max-w-sm">
        <h1 className="text-4xl text-center mb-6">Login</h1>

        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offScreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          <InputField
            id="email"
            inputType="email"
            placeholder="Enter email"
            label="Email address"
            handleChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            id="password"
            inputType="password"
            placeholder="Password"
            label="Password"
            handleChange={(e) => setPassword(e.target.value)}
          />
          <Checkbox
            id="remember"
            label="Remember me"
            onChange={toggleCheck}
            checked={check}
          />
          <Button label="Sign in" />
          <p className="text-gray-800 mt-6 text-center">
            Not a member?{" "}
            <Link
              to="/signup"
              className="text-gray-800 hover:text-gray-900 transition duration-200 ease-in-out font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
