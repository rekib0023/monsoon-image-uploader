import Container from "../components/Container";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const { auth } = useAuth();

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
    <Container>
      {isLoaded && (
        <div className="flex items-center">
          <h1 className="text-4xl mt-16">Welcome {user.name} 👋</h1>
          <button
            class="ml-auto mt-16 bg-transparent hover:bg-gray-900 text-gray-900 font-semibold hover:text-white py-2 px-4 border border-gray-900 hover:border-transparent rounded"
            onClick={signOut}
          >
            Logout
          </button>
        </div>
      )}
    </Container>
  );
};

export default Home;
