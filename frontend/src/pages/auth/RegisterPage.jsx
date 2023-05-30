import { React, useState, useReducer, useEffect } from "react";
import loginImg from "../../assets/login.jpg";
import Input from "../../components/authcomp/Input";
import BirthSelectInput from "../../components/authcomp/BirthSelectInput";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authAction";
import { validateLoginForm } from "../../components/Validator";

const getFormNotValidMessage = () => {
  return "Enter correct email and password which contain 6-20 characters to login.";
};

const getFormValidMessage = () => {
  return "You can register in now.";
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};
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

const RegisterPage = ({ register }) => {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(userReducer, initUserState);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      validateLoginForm({
        email: state.email,
        password: state.password,
      })
    );
  }, [state.email, state.password]);

  function handleSubmitRegister(e) {
    e.preventDefault();
    register(state, navigate);
  }

  function handleUserChange(type, value) {
    dispatch({ type: `SET_${type.toUpperCase()}`, payload: value });
  }
  return (
    <div className="grid h-screen w-full grid-cols-1 sm:grid-cols-2">
      <div className="hidden sm:block">
        <img className="h-full w-full object-cover" src={loginImg} alt="" />
      </div>

      <div className="flex  flex-col justify-center bg-gray-800 text-gray-400">
        <form
          className="mx-auto w-full max-w-[480px] rounded-lg bg-gray-900 p-8 px-8"
          onSubmit={handleSubmitRegister}
          type="POST"
        >
          <h2 className="text-center text-2xl font-bold dark:text-white">
            Create an account
          </h2>
          <Input
            label="Email"
            type="email"
            name="email"
            setValue={handleUserChange.bind(null, "email")}
            value={state.email}
          />
          {/* con */}
          <div className="error"></div>
          <Input
            label="Username"
            type="text"
            name="username"
            setValue={handleUserChange.bind(null, "username")}
            value={state.username}
          />
          <div className="error"></div>
          <Input
            label="Password"
            type="password"
            name="password"
            setValue={handleUserChange.bind(null, "password")}
            value={state.password}
          />
          <div className="error"></div>
          <BirthSelectInput onChange={handleUserChange} value={state.birth} />
          <button
            data-te-toggle="tooltip"
            title={
              isFormValid ? getFormValidMessage() : getFormNotValidMessage()
            }
            className="mb-1 mt-5 w-full rounded-lg bg-teal-500 py-2 font-semibold text-white shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 disabled:bg-gray-400 disabled:shadow-none"
            type="submit"
            disabled={!isFormValid}
            onClick={handleSubmitRegister}
          >
            Register
          </button>
          <div className="text-center">
            <span
              className="text-xs text-blue-500 hover:cursor-pointer hover:border-b hover:border-blue-500"
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
};

export default connect(null, mapActionsToProps)(RegisterPage);
