import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token from storage:", token);
    console.log("nigga Anfh");
    if (token) {
      setUser(1);
    }
  }, []);

  const login = (userData, navigate) => {
    const decoded = jwtDecode(userData.token);
    console.log("Logging in with token:", decoded);

    setUser(1);
    localStorage.setItem("token", userData.token);
    navigate("/dashboard");
    toast.success("Login successful!");
  };

  const logout = (navigate) => {
    setUser(2);
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
