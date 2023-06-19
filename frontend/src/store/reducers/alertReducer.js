import alertAction from "../actions/alertAction";

const initState = {
  showAlert: false,
  alertMessageContent: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case alertAction.SHOW_ALERT_MESSAGE:
      return {
        ...state,
        showAlert: true,
        alertMessageContent: action.content,
      };
    case alertAction.HIDE_ALERT_MESSAGE:
      return {
        ...state,
        showAlert: false,
        alertMessageContent: null,
      }
    default:
      return state;
  }
};

export default reducer;
