import { element } from "prop-types";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import AlertNotification from "./components/AlertNotification";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <div>DashBoard</div>,
  },
  {
    path: "/",
    element: <Navigate replace to="/dashboard" />,
  },
]);

function App() {
  return (
  <>
    <RouterProvider router={router} />
    <AlertNotification />
  </>
  )
}
  

export default App;
