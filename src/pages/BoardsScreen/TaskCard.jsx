import { Card, CardContent, Typography, Chip, Box, IconButton } from "@mui/material";
import { AccessTime, Flag, CheckCircle, Delete } from "@mui/icons-material";

const TaskCard = ({ task, provided, onDeleteTask }) => {
  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{
        background: "linear-gradient(135deg, #1E1E1E 30%, #292929 100%)",
        padding: 2,
        borderRadius: "12px",
        boxShadow: 5,
        color: "#E0E0E0",
        transition: "0.3s",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        "&:hover": { transform: "scale(1.02)", borderColor: "#FFFFFF55" },
        position: "relative",
        marginTop: '8px'
      }}
    >
      <IconButton
        onClick={() => onDeleteTask(task.id, task.title)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#FF4C4C",
          "&:hover": { color: "#D32F2F" },
        }}
      >
        <Delete />
      </IconButton>

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF", marginBottom: 1 }}>
          {task.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#B0B0B0", marginBottom: 2 }}>
          {task.description}
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
          <Chip
            icon={<AccessTime sx={{ color: "#FFA500" }} />}
            label={`Due: ${task.dueDate}`}
            sx={{ backgroundColor: "#333", color: "#FFA500", fontWeight: "bold" }}
          />

          <Chip
            icon={<Flag />}
            label={`Priority: ${task.priority}`}
            sx={{
              backgroundColor:
                task.priority === "High" ? "#FF4C4C" :
                task.priority === "Medium" ? "#FFD700" :
                "#4CAF50",
              color: "#000",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Box marginTop={2} display="flex">
          <Chip
            icon={<CheckCircle />}
            label={task.status}
            sx={{
              backgroundColor:
                task.status === "To Do" ? "#5C5CFF" :
                task.status === "In Progress" ? "#FFA500" :
                "#00BFFF",
              color: "#FFF",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
