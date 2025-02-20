import { useState } from "react";
import { Container, Stack, TextField, Button, Typography } from "@mui/material";
import BrandLogo from "../../assets/logo.svg";
import ImageComponent from "../../components/utils/ImageEl";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import useStore from "../../store";

const defaultCredentials = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [credentials, setCredentials] = useState(defaultCredentials);
  const { setToastr } = useStore();

  const handleInputChange = (event) =>
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [event.target.name]: event.target.value,
    }));

  const processAuthentication = async () => {
    try {
      setIsProcessing(true);
      if (isSigningIn) {
        await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
      } else {
        await createUserWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
      }
    } catch (err) {
      const message = err.code.split("auth/")[1].replace(/-/g, " ");
      setToastr(message);
      setIsProcessing(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 10,
      }}
    >
      <Stack mb={6} spacing={4} alignItems="center" textAlign="center">
        <Typography color="rgba(255,255,255, .6)">
        Boost productivity with seamless task management.
        </Typography>
      </Stack>
      
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
        {isSigningIn ? "Sign In to Your Account" : "Create a New Account"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          value={credentials.email}
          name="email"
          onChange={handleInputChange}
          label="Email"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90caf9",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#42a5f5",
              },
            },
            input: {
              color: "#fff",
            },
            label: {
              color: "rgba(255,255,255,0.7)",
            },
          }}
        />
        <TextField
          value={credentials.password}
          type="password"
          name="password"
          onChange={handleInputChange}
          label="Password"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90caf9",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#42a5f5",
              },
            },
            input: {
              color: "#fff",
            },
            label: {
              color: "rgba(255,255,255,0.7)",
            },
          }}
        />
        <Button
          disabled={
            isProcessing || !credentials.email.trim() || !credentials.password.trim()
          }
          onClick={processAuthentication}
          size="large"
          variant="contained"
          style={{ borderRadius: '6px' }}
        >
          {isSigningIn ? "Sign In" : "Create Account"}
        </Button>
        <Button
          onClick={() => setIsSigningIn((prev) => !prev)}
          size="small"
          variant="text"
          sx={{ mt: 1, textTransform: "none" }}
        >
          {isSigningIn ? "New here? Create an account" : "Already a member? Sign in"}
        </Button>
      </Stack>
    </Container>
  );
};

export default LoginPage;
