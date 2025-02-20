import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./styles.css";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const userId = "someUserId";

  useEffect(() => {
    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      let fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ensure `dueDate` exists and is a valid date before sorting
      if (sortOrder) {
        fetchedTasks = fetchedTasks.filter((task) => task.dueDate);
        fetchedTasks.sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

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
  }, [sortOrder]);

  const addTask = async (id, title) => {
    console.log(id, title, "check");
    await addDoc(collection(db, "activityLogs"), {
      action: "Task Created",
      taskId: id,
      taskTitle: title,
      userId,
      timestamp: new Date(),
    });
    setTasks(tasks.filter((task) => task.id !== taskId));
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

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      priorityFilter ? task.priority === priorityFilter : true
    )
    .sort((a, b) => {
      if (!sortOrder) return 0;
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <>
      <Topbar openModal={() => setShowModal(true)} />
      {showModal && (
        <CreateBoardModal
          closeModal={() => setShowModal(false)}
          onSubmitForm={addTask}
        />
      )}

      <Container sx={{ maxWidth: "none" }} className="containerId">
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4} className="topAdjust">
            <TextField
              fullWidth
              label="Search Tasks"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Filter by Priority"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort by Due Date</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={8}>
            <DragDropContext onDragEnd={() => {}}>
              <Grid container spacing={2}>
                {["ToDo", "InProgress", "Done"].map((status) => (
                  <Grid item xs={12} sm={4} key={status}>
                    <TaskColumn
                      status={status}
                      tasks={filteredTasks.filter(
                        (task) => task.status === status
                      )}
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
              height: "800px", 
              overflowY: "auto", 
              backgroundColor: "#37665d",
              p: 2
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
