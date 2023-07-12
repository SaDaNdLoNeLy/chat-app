import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatPage from "./pages/chat/ChatPage";
import { Route, Routes } from "react-router-dom";
import AlertNotification from "./components/AlertNotification";
import CallRoom from "./pages/call/CallRoom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/register" Component={RegisterPage} />
        <Route path="/dashboard" Component={ChatPage} />
        <Route path="/call" Component={CallRoom} />
        <Route path="/" Component={ChatPage} />
      </Routes>
      <AlertNotification />
    </>
  );
}

export default App;
