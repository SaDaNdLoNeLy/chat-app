import { Navigate, Outlet } from "react-router-dom";
import { ChatState } from "../StateProvider";
export default function PublicRoute({ ...rest }) {
  const { user } = ChatState();

  return user ? <Navigate to="/dashboard" replace /> : <Outlet {...rest} />;
}
