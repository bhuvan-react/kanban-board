import { Paper, Typography, Box } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const statusColors = {
  ToDo: "#1976D2",
  InProgress: "#FFA726",
  Done: "#66BB6A",
};

const TaskColumn = ({ status, tasks }) => {
  console.log(status, "status");
  return (
    <Paper
      sx={{
        width: "100%",
        minHeight: 400,
        padding: 2,
        backgroundColor: "#2A2A2A",
        borderRadius: "8px",
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 2,
          color: statusColors[status] || "white",
        }}
      >
        {status} ({tasks.length})
      </Typography>

      <Droppable droppableId={status}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "#252525",
              borderRadius: "8px",
              padding: 1,
              border: `2px solid ${statusColors[status] || "gray"}`,
            }}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(provided) => (
                    <TaskCard
                      task={task}
                      provided={provided}
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))
            ) : (
              <Typography
                sx={{ textAlign: "center", padding: 2, color: "gray" }}
              >
                No tasks
              </Typography>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default TaskColumn;
