import { Paper, Typography, Box } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const statusColors = {
  ToDo: "#1976D2",
  InProgress: "#FFA726",
  Done: "#66BB6A",
};

const TaskColumn = ({ status, tasks, onDeleteTask }) => {
  return (
    <Paper
      sx={{
        width: "100%",
        minHeight: 500, // Fixed minimum height
        maxHeight: "80vh", // Prevents overflow
        display: "flex",
        flexDirection: "column",
        padding: 2,
        backgroundColor: "#2A2A2A",
        borderRadius: "8px",
        boxShadow: 2,
        overflow: "hidden", // Prevents overall column from scrolling
      }}
    >
      {/* Status Title (Fixed, Non-Scrollable) */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 2,
          color: statusColors[status] || "white",
          flexShrink: 0, // Ensures title stays fixed
        }}
      >
        {status} ({tasks.length})
      </Typography>

      {/* Scrollable Task List */}
      <Droppable droppableId={status}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flexGrow: 1, // Allows it to expand
              overflowY: "auto", // Enables scrolling
              backgroundColor: "#252525",
              borderRadius: "8px",
              padding: 1,
              border: `2px solid ${statusColors[status] || "gray"}`,
            }}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <TaskCard
                      task={task}
                      provided={provided}
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onDeleteTask={onDeleteTask}
                    />
                  )}
                </Draggable>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", padding: 2, color: "gray" }}>
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
