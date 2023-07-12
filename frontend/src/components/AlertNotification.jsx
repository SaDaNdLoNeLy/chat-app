import { Alert, Snackbar } from "@mui/material";
import { getActions } from "../store/actions/alertAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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

AlertNotification.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  hideAlertMessage: PropTypes.func.isRequired,
  alertMessageContent: PropTypes.string.isRequired,
};

export default connect(
  mapStoreStateToProps,
  mapActionsToProps
)(AlertNotification);
