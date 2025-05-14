import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { getProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkAuth = async () => {
      console.log("Token from storage:", token);

      try {
       const res = await getProfile(); // Assume getProfile() returns a Promise
        console.log("res", res, "status", res.status);

        if (res.username) {
          setUser(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.clear();
          setUser(false);
        }
        console.log("Error fetching profile:", error);

      }
    };
    // console.log("Token from storage:", token);
    if (token) {
      checkAuth();
    } else {
      setUser(false);
    }
  }, []);

  const login = (userData, navigate) => {
    const decoded = jwtDecode(userData.token);
    console.log("Logging in with token:", decoded);

    setUser(true);
    localStorage.setItem("token", userData.token);
    navigate("/dashboard");
    toast.success("Login successful!");
  };

  const logout = (navigate) => {
    setUser(false);
    localStorage.removeItem("token");
    navigate("/admin");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
