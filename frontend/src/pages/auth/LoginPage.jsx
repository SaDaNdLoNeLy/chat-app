/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
// import * as Components from './com.js';
import loginImg from "../../assets/login.jpg";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { validateLoginForm } from "../../components/Validator";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authAction";

const getFormNotValidMessage = () => {
  return "Enter correct email and password which contain 6-20 characters to login.";
};

const getFormValidMessage = () => {
  return "You can login in now.";
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

const LoginPage = ({ login }) => {
  const history = useNavigate();
  const navigate = useNavigate();
  // const [signIn, toggle] = React.useState(true);\
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validateLoginForm({ email, password }));
  }, [email, password, setIsFormValid]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userDetails = {
      email,
      password,
    };
    console.log(userDetails);
    login(userDetails, history);
  };

  return (
    <div className="grid h-screen w-full grid-cols-1 sm:grid-cols-2">
      <div className="hidden sm:block">
        <img className="h-full w-full object-cover" src={loginImg} alt="" />
      </div>

      <div className="flex flex-col justify-center bg-gray-800">
        <form className="mx-auto w-full max-w-[400px] rounded-lg bg-gray-900 p-8 px-8">
          <h2 className="text-center text-2xl font-bold dark:text-white">
            Welcome back!
          </h2>
          <h2 className="text-center text-xs font-bold dark:text-gray-400">
            We're so excited to see you again!
          </h2>

          <Input label="Email" type="email" setValue={setEmail} />
          <Input label="Password" type="password" setValue={setPassword} />

          <div className="flex justify-between py-2 text-gray-400">
            {/* <p className='flex items-center'><Input className='mr-2' type="checkbox" /> Remember Me</p> */}
            <span className="text-gray-400 hover:text-gray-200">
              Forgot your password?
            </span>
          </div>
          <button
            data-te-toggle="tooltip"
            title={
              isFormValid ? getFormValidMessage() : getFormNotValidMessage()
            }
            className="mb-1 mt-5 w-full rounded-lg bg-teal-500 py-2 font-semibold text-white shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 disabled:bg-gray-400 disabled:shadow-none"
            type="submit"
            disabled={!isFormValid}
            onClick={handleLogin}
          >
            Log in
          </button>
          <div className="text-center">
            <span
              className="text-xs text-blue-500 hover:cursor-pointer hover:border-b hover:border-blue-500"
              onClick={() => {
                console.log("Redirecting to register page...");
                navigate("/register", { replace: true });
              }}
            >
              {" "}
              Need an account?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(null, mapActionsToProps)(LoginPage);
