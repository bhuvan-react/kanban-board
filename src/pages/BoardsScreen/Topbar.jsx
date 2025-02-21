import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import ImageEl from "../../components/utils/ImageEl";
import LogoImg from "../../assets/logo.svg";
import LogoutIcon from "@mui/icons-material/Logout"; 
import CreateBoardIcon from "@mui/icons-material/AddCircle";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Topbar = ({ openModal }) => {
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <ImageEl
          sx={{
            height: "25px",
          }}
          src={LogoImg}
          alt="Kanban"
        />
        <Stack direction="row" spacing={2}>
          {isXs ? (
            <>
              <IconButton onClick={openModal} color="primary">
                <CreateBoardIcon />
              </IconButton>
              <IconButton onClick={() => signOut(auth)}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                onClick={openModal}
                sx={{
                  backgroundColor: "#1976d2", 
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                Create Task
              </Button>
              <Button
                onClick={() => signOut(auth)}
                startIcon={<LogoutIcon />} 
                color="inherit"
              >
                Logout
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
