import * as api from "../../api";
import { showAlertMessage } from "./alertAction";
import { MONTHS, zeroPad } from "../../util/date";
export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const getActions = (dispatch) => {
  return {
    login: (userDetails, history) => dispatch(login(userDetails, history)),
    register: (userDetails, history) =>
      dispatch(register(userDetails, history)),
    setUserDetails: (userDetails) => dispatch(setUserDetails(userDetails)),
  };
};

const setUserDetails = (userDetails) => {
  return {
    type: authActions.SET_USER_DETAILS,
    userDetails,
  };
};

const login = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await api.login(userDetails);
    console.log(response);
    if (response.err) {
      dispatch(showAlertMessage(response?.err?.response?.data));
    } else {
      const { userDetails } = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/dashboard");
    }
  };
};

const register = (userDetails, navigate) => {
  return async (dispatch) => {
    const month = MONTHS.indexOf(userDetails.birth.month) + 1;
    const dateString = `${userDetails.birth.year}-${zeroPad(
      month,
      2
    )}-${zeroPad(userDetails.birth.date, 2)}`;
    const response = await api.register({
      password: userDetails.password,
      email: userDetails.email,
      username: userDetails.username,
      dob: dateString,
    });
    if (response.err) {
      dispatch(showAlertMessage(response?.err?.response?.data));
    } else {
      const { userDetails } = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/dashboard");
    }
  };
};
