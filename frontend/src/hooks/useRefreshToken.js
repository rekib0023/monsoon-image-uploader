import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "/login/refresh",
      JSON.stringify({
        refresh: auth.refreshToken,
      }),

      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setAuth((prev) => {
      return { ...prev, accessToken: response.data.access };
    });
    console.log(auth);
    return response.data.access;
  };
  return refresh;
};

export default useRefreshToken;
