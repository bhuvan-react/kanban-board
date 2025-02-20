import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme";

const BoardCard = ({ name, color, createdAt, id }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Stack
        p={2}
        height={160}
        bgcolor="background.paper"
        borderRadius={4}
        position="relative"
        overflow="hidden"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        sx={{
          "&::before": {
            content: '""',
            position: "absolute",
            top: -5,
            left: -5,
            right: -5,
            bottom: -5,
            background: `linear-gradient(135deg, ${colors[color]} 0%, transparent 100%)`,
            zIndex: 0,
            borderRadius: 4,
          },
          "&:hover": {
            boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
            transition: "0.3s ease-in-out",
          },
        }}
      >
        {/* Top Section - Name & Icon */}
        <Stack direction="row" alignItems="center" spacing={1} zIndex={1}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            flexGrow={1}
          >
            {name}
          </Typography>
          <IconButton
            onClick={() => navigate(`/boards/${id}`)}
            sx={{
              bgcolor: colors[color],
              color: "#fff",
              "&:hover": { bgcolor: colors[color] },
            }}
          >
            <FolderOpenIcon />
          </IconButton>
        </Stack>

        {/* Bottom Section - Created Date */}
        <Box
          position="absolute"
          bottom={10}
          right={10}
          zIndex={1}
          bgcolor="rgba(0,0,0,0.05)"
          px={2}
          py={0.5}
          borderRadius={2}
        >
          <Typography variant="caption" color="text.secondary">
            Created: {createdAt}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
};

export default BoardCard;
