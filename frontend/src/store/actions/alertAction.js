const alertAction = {
  SHOW_ALERT_MESSAGE: "ALERT.SHOW_ALERT_MESSAGE",
  HIDE_ALERT_MESSAGE: "ALERT.HIDE_ALERT_MESSAGE",
};

export const getActions = (dispatch) => {
  return {
    showAlertMessage: (content) => dispatch(showAlertMessage(content)),
    hideAlertMessage: () => dispatch(hideAlertMessage()),
  };
};

export const showAlertMessage = (content) => {
  return {
    type: alertAction.SHOW_ALERT_MESSAGE,
    content,
  };
};

export const hideAlertMessage = () => {
  return {
    type: alertAction.HIDE_ALERT_MESSAGE,
  };
};

export default alertAction;
