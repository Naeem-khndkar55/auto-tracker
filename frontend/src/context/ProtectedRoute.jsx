import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ✅ Import useAuth

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log("Protected route check - user:", user); // ✅ Debugging log

  // return user ? children : <Navigate to="/admin" />;
  if (user === 1) {
    return children;
  } else if (user == 2) {
    return <Navigate to="/admin" />;
  } else {
    return <></>;
  }
};

export default ProtectedRoute;
