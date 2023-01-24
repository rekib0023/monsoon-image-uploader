import axios from "../api/axios";
import useAuth from "./useAuth";
import getLocalValue from "../hooks/useLocalStorage";

const useRefreshToken = () => {
  const persist = getLocalValue("persist", null)[0];
  const { setAuth, auth } = useAuth();
  let refreshToken = "";
  if (persist) {
    refreshToken = getLocalValue("refreshToken", null)[0];
  } else {
    refreshToken = auth.refreshToken;
  }

  const refresh = async () => {
    const response = await axios.post(
      "/login/refresh",
      {
        refresh: refreshToken,
      },

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
