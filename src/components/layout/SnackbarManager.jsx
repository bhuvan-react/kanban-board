import { Snackbar } from "@mui/material";
import useStore from "../../store";

const SnackbarManager = () => {
  const { toastrMsg, setToastr } = useStore();
  return (
    <Snackbar
      message={toastrMsg}
      open={!!toastrMsg}
      autoHideDuration={5000}
      onClose={() => setToastr("")}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    />
  );
};

export default SnackbarManager;
