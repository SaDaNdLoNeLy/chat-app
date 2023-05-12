export const validateLoginForm = ({ email, password }) => {
  const isEmailValid = validateEmail(email);
  const isPassWordValid = validatePassWord(password);

  return isEmailValid && isPassWordValid;
};

const validatePassWord = (password) => {
  return password.length >= 6 && password.length <= 20;
};

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};
