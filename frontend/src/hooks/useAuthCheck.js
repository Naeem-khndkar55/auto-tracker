import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile } from "../services/api";

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        res = await getProfile(); // Assume getProfile() returns a Promise
        console.log("res", res);
        
        if (!res.status == 401 || !res.status == 200) {
          navigate("/admin");
        }
      } catch (error) {
        if (error.response && error.response.status === 401 || error.response.status !== 200) {
          localStorage.removeItem("token");
          sessionStorage.clear();
          navigate("/admin");
        }
      }
    };

    checkAuth(); // Call the function
  }, [navigate]);
};
