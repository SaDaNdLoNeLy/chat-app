import { Navigate, Outlet } from "react-router-dom";
import { ChatState } from "../StateProvider";
export default function PrivateRoute({ ...rest }) {
  const { user } = ChatState();
  const currentLocation = window.location.pathname;
  console.log("currentLocation: ", currentLocation);
  return user ? (
    <Outlet {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: currentLocation }} replace />
  );
}
