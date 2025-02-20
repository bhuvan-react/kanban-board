import { useState } from "react";
import {
  Dialog,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from "../../firebase"; 
import { addDoc, collection } from "firebase/firestore";
import useStore from "../../store";
import ModalHeader from "../../components/layout/ModalHeader";
import { auth } from "../../firebase"; 

const taskSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be under 50 characters"),
  description: z.string()
    .max(200, "Description must be under 200 characters")
    .optional(),
  dueDate: z.string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Priority is required",
  }),
  status: z.enum(["ToDo", "InProgress", "Done"], {
    required_error: "Status is required",
  }),
});

const CreateTaskModal = ({ closeModal, userId }) => {
  const { setToastr } = useStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = auth.currentUser; 
  
      if (!user || !user.email) {
        throw new Error("User not authenticated");
      }
  
      const taskData = {
        ...data,
        createdBy: user.email, 
        createdAt: new Date().toISOString(),
      };
  
      const docRef = await addDoc(collection(db, "tasks"), taskData);
      console.log("Task Created with ID:", docRef.id);
      setToastr("Task Created Successfully");
      closeModal();
    } catch (err) {
      setLoading(false);
      console.error("Error adding task:", err.message);
      setToastr("Failed to create task");
    }
  };

  return (
    <Dialog open onClose={closeModal} fullWidth maxWidth="xs">
      <Stack p={3} spacing={3}>
        <ModalHeader onClose={closeModal} title="New Task" />

        <TextField
          label="Title"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />

        <TextField
          label="Description"
          {...register("description")}
          fullWidth
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          label="Due Date"
          type="date"
          {...register("dueDate")}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={!!errors.dueDate}
          helperText={errors.dueDate?.message}
        />

        <TextField
          label="Priority"
          select
          {...register("priority")}
          error={!!errors.priority}
          helperText={errors.priority?.message}
          fullWidth
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <TextField
          label="Status"
          select
          {...register("status")}
          error={!!errors.status}
          helperText={errors.status?.message}
          fullWidth
        >
          <MenuItem value="ToDo">To Do</MenuItem>
          <MenuItem value="InProgress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </TextField>

        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default CreateTaskModal;
