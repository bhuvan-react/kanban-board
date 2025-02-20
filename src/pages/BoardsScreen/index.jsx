import { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, List } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";
import CreateBoardModal from "./CreateBoardModal";
import Topbar from "./Topbar";
import {
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import './containerStyles.css'

const KanbanBoard = () => {
  const addDummyActivityLogs = async () => {
    const logsRef = collection(db, "activityLogs");
    const snapshot = await getDocs(logsRef);

    if (!snapshot.empty) return; // Prevent duplicates

    await addDoc(logsRef, {
      action: "Task Created",
      taskId: "dummyTask123",
      taskTitle: "Sample Task",
      userId: "testUser",
      timestamp: serverTimestamp(),
    });

    await addDoc(logsRef, {
      action: "Task Moved",
      taskId: "dummyTask456",
      taskTitle: "Another Task",
      userId: "testUser",
      timestamp: serverTimestamp(),
    });

    console.log("Dummy activity logs added!");
  };

  useEffect(() => {
    addDummyActivityLogs();
  }, []);
  const [tasks, setTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const userId = "someUserId";

  useEffect(() => {
    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });

    const unsubscribeLogs = onSnapshot(
      collection(db, "activityLogs"),
      (snapshot) => {
        const fetchedLogs = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => b.timestamp - a.timestamp);
        setActivityLog(fetchedLogs);
      }
    );

    return () => {
      unsubscribeTasks();
      unsubscribeLogs();
    };
  }, []);

  const addTask = async (data) => {
    const newTask = {
      ...data,
      status: "ToDo",
      createdAt: new Date(),
      createdBy: userId || "",
    };

    const taskRef = await addDoc(collection(db, "tasks"), newTask);

    await addDoc(collection(db, "activityLogs"), {
      action: "Task Created",
      taskId: taskRef.id,
      taskTitle: data.title,
      userId,
      timestamp: new Date(),
    });

    setShowModal(false);
  };

  // const onDragEnd = async (result) => {
  //   if (!result.destination) return;

  //   const updatedTasks = [...tasks];
  //   const [movedTask] = updatedTasks.splice(result.source.index, 1);
  //   const oldStatus = movedTask.status;
  //   movedTask.status = result.destination.droppableId;

  //   await updateDoc(doc(db, "tasks", movedTask.id), {
  //     status: movedTask.status,
  //   });

  //   await addDoc(collection(db, "activityLogs"), {
  //     action: `Task moved from ${oldStatus} to ${movedTask.status}`,
  //     taskId: movedTask.id,
  //     taskTitle: movedTask.title,
  //     userId,
  //     timestamp: new Date(),
  //   });
  //   updatedTasks.splice(result.destination.index, 0, movedTask);
  //   setTasks(updatedTasks);
  // };

  const onDragEnd = async (result) => {
    console.log("Drag started", tasks);
    if (!result.destination) return; // Ensure drop happened
  console.log("Dragging result:", result);
    const { source, destination, draggableId } = result;
  
    if (!destination) return; // If dropped outside a column, do nothing
  
    const updatedTasks = [...tasks];
    const movedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId);
  
    if (movedTaskIndex === -1) return;
  
    const movedTask = updatedTasks[movedTaskIndex];
    const oldStatus = movedTask.status;
    const newStatus = destination.droppableId;
  
    if (oldStatus !== newStatus) {
      await updateDoc(doc(db, "tasks", draggableId), {
        status: newStatus,
      });
  
      await addDoc(collection(db, "activityLogs"), {
        action: `Task moved from ${oldStatus} to ${newStatus}`,
        taskId: draggableId,
        taskTitle: movedTask.title,
        userId,
        timestamp: serverTimestamp(),
      });
  
      movedTask.status = newStatus;
    }
  
    updatedTasks.splice(movedTaskIndex, 1);
    updatedTasks.splice(destination.index, 0, movedTask);
  
    setTasks(updatedTasks);
  };
  

  const deleteTask = async (taskId, taskTitle) => {
    await deleteDoc(doc(db, "tasks", taskId));

    await addDoc(collection(db, "activityLogs"), {
      action: "Task Deleted",
      taskId,
      taskTitle,
      userId,
      timestamp: new Date(),
    });

    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <Topbar openModal={() => setShowModal(true)} />
      {showModal && (
        <CreateBoardModal
          closeModal={() => setShowModal(false)}
          onSubmit={addTask}
        />
      )}

      <Container sx={{ maxWidth: "none" }} className="containerId">
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={8}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Grid container spacing={2}>
                {["ToDo", "InProgress", "Done"].map((status) => (
                  <Grid item xs={12} sm={4} key={status}>
                    <TaskColumn
                      status={status}
                      tasks={tasks.filter((task) => task.status === status)}
                      onDeleteTask={deleteTask}
                    />
                  </Grid>
                ))}
              </Grid>
            </DragDropContext>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                height: "100%",
                overflowY: "auto",
                p: 2,
                backgroundColor: "#37665d",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Activity Logs
              </Typography>
              <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {activityLog.length > 0 ? (
                  activityLog.map((log, index) => (
                    <Paper
                      key={index}
                      elevation={3}
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        backgroundColor: log.action.includes("Deleted")
                          ? "#ffebee"
                          : log.action.includes("Moved")
                          ? "#e3f2fd"
                          : "#e8f5e9",
                        borderLeft: `6px solid ${
                          log.action.includes("Deleted")
                            ? "#d32f2f"
                            : log.action.includes("Moved")
                            ? "#1976d2"
                            : "#388e3c"
                        }`,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ color: "#333" }}
                      >
                        {log.action}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {log.taskTitle || "Task"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        {log.timestamp
                          ? new Date(log.timestamp.toDate()).toLocaleString()
                          : "N/A"}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No activity logs yet.
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default KanbanBoard;
