import { createTheme } from "@mui/material";

export const colors = [
  "#A8DADC", 
  "#F4A261", 
  "#81B29A", 
  "#E9C46A",   
  "#E76F51", 
  "#B2B8A3", 
];

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1E1E1E",
    },
    primary: {
      main: "#BEA4FF",
    },
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        message: {
          fontWeight: 600,
          textTransform: "capitalize",
        },
      },
    },
  },
  typography: {
    fontFamily: "Lato, sans-serif",
    button: {
      textTransform: "unset",
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
