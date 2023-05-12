/* eslint-disable no-unused-vars */
import { React, useState, useReducer } from "react";
import axios from "axios";
import loginImg from "../../assets/login.jpg";
import Input from "../../components/Input";
import BirthSelectInput from "../../components/BirthSelectInput";
import { useNavigate } from "react-router-dom";
const initUserState = {
  email: "",
  password: "",
  username: "",
  birth: {
    date: "",
    month: "",
    year: "",
  },
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_DATE":
      return { ...state, birth: { ...state.birth, date: action.payload } };
    case "SET_MONTH":
      return { ...state, birth: { ...state.birth, month: action.payload } };
    case "SET_YEAR":
      return { ...state, birth: { ...state.birth, year: action.payload } };
    default:
      return state;
  }
}

export default function RegisterPage() {
  const [state, dispatch] = useReducer(userReducer, initUserState);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmitRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

    // axios.post("/api/auth/register", state).then((response) => {
    //   console.log(response.status);
    //   console.log(response.data);
    //   if(response.status === 201){
    //     window.location.href = "/login";
    //   }
    // }).catch((error) => {
    //   console.error("Registration failed:", error);
    //     setErrorMessage("Registration failed. Please try again.");
    //     setIsLoading(false);
    // })
  }

  function handleUserChange(type, value) {
    dispatch({ type: `SET_${type.toUpperCase()}`, payload: value });
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={loginImg} alt="" />
      </div>

      <div className="bg-gray-800  text-gray-400 flex flex-col justify-center">
        <form
          className="max-w-[480px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8"
          onSubmit={handleSubmitRegister}
          type="POST"
        >
          <h2 className="text-2xl dark:text-white font-bold text-center">
            Create an account
          </h2>
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={handleUserChange}
            value={state.email}
          />
          {/* con */}
          <div className="error"></div>
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={handleUserChange}
            value={state.username}
          />
          <div className="error"></div>
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={handleUserChange}
            value={state.password}
          />
          <div className="error"></div>
          <BirthSelectInput onChange={handleUserChange} value={state.birth} />
          <button className="w-full mt-5 mb-2 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg">
            {isLoading ? "Loading..." : "Continue"}
          </button>
          <div className="text-center">
            <span
              className="text-xs text-blue-500 hover:border-b hover:border-blue-500 hover:cursor-pointer"
              onClick={() => {
                console.log("Redirecting to login page...");
                navigate("/login", { replace: true });
              }}
            >
              Already have an account?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}