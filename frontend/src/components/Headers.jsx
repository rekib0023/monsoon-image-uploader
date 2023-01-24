import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Headers = ({ setShowModal }) => {
  const [user, setUser] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/me", {
          signal: controller.signal,
        });
        setUser(response.data);
        setIsLoaded(true);
      } catch (error) {
        console.error(error.response);
        toast.error(error.response.data.detail);
      }
    };
    getUser();
  }, []);
  console.log(user);
  return (
    <>
      {isLoaded && (
        <div className="flex items-center">
          <div>
            {" "}
            <h1 className="text-4xl mt-16">Welcome {user.name} 👋</h1>
            <p>{user.email}</p>
          </div>
          <div className="ml-auto mt-16">
            <button
              className="hover:bg-gray-900 bg-gray-700 font-semibold text-white py-2 px-4 hover:border-transparent rounded"
              onClick={() => setShowModal(true)}
            >
              Upload Image
            </button>
            <button
              className="ml-4 bg-transparent hover:bg-gray-900 text-gray-900 font-semibold hover:text-white py-2 px-4 border border-gray-900 hover:border-transparent rounded"
              onClick={signOut}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Headers;
