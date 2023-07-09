import { useContext } from "react";
import { useLocation } from "react-router-dom"
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";


function ProtectedRoutes(){
  const { authUser } = useAuth();
  const location = useLocation();
  return authUser ? <Outlet /> : <Navigate to="login" replace state={{ from: location}}/>;
}

export default ProtectedRoutes;