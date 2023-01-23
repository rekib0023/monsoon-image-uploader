import { Link } from "react-router-dom";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import InputField from "../components/InputField";

const Signup = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 block p-6 bg-white  max-w-sm">
        <h1 className="text-4xl text-center mb-6">Register</h1>

        <form>
          <InputField
            id="text"
            type="text"
            placeholder="Enter your name"
            label="Name"
          />
          <InputField
            id="email"
            type="email"
            placeholder="Enter email"
            label="Email address"
          />
          <InputField
            id="password"
            type="password"
            placeholder="Password"
            label="Password"
          />
          <Checkbox id="remember" label="Remember me" />
          <Button label="Register" />
          <p className="text-gray-800 mt-6 text-center">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-gray-800 hover:text-gray-900 transition duration-200 ease-in-out font-medium"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
