import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { getActions } from "../store/actions/alertAction";
import { connect } from "react-redux";

const AlertNotification = ({
  showAlert,
  hideAlertMessage,
  alertMessageContent,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={showAlert}
      onClose={hideAlertMessage}
      autoHideDuration={6000}
    >
      <Alert severity="info">{alertMessageContent}</Alert>
    </Snackbar>
  );
};

const mapStoreStateToProps = ({ alert }) => {
  return {
    ...alert,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(
  mapStoreStateToProps,
  mapActionsToProps
)(AlertNotification);
