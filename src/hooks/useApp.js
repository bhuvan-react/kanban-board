import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import useStore from "../store";
import { useNavigate } from "react-router-dom";

const useApp = () => {
  const navigate = useNavigate();
  const {
    currentUser: { uid },
  } = getAuth();
  const boardsColRef = collection(db, `users/${uid}/boards`);
  const { boards, setBoards, addBoard, setToastr } = useStore();
  console.log(boards, 'boards')
  const deleteBoard = async (boardId) => {
    try {
      const docRef = doc(db, `users/${uid}/boards/${boardId}`);
      await deleteDoc(docRef);

      const tBoards = boards.filter((board) => board.id !== boardId);
      setBoards(tBoards);

      navigate("/boards");
    } catch (err) {
      setToastr("Error deleting the board");
      throw err;
    }
  };

  const updateBoardData = async (boardId, tabs) => {
    const docRef = doc(db, `users/${uid}/boardsData/${boardId}`);
    try {
      await updateDoc(docRef, { tabs, lastUpdated: serverTimestamp() });
    } catch (err) {
      setToastr("Error updating board");
      throw err;
    }
  };

  const fetchBoard = async (boardId) => {
    const docRef = doc(db, `users/${uid}/boardsData/${boardId}`);
    try {
      const doc = await getDoc(docRef);
      if (doc.exists) {
        return doc.data();
      } else return null;
    } catch (err) {
      setToastr("Error fetching board");
      throw err;
    }
  };

  const createBoard = async ({ createdBy, description, dueDate, priority, status, title }) => {
    try {
      const doc = await addDoc(boardsColRef, {
        createdBy,
        description,
        dueDate,
        priority,
        status, 
        title
      });

      addBoard({
        createdBy,
        description,
        dueDate,
        priority,
        status, 
        title,
        createdAt: new Date().toLocaleString("en-US"),
        id: doc.id,
      });
    } catch (err) {
      setToastr("Error creating board");
      throw err;
    }
  };

  const fetchBoards = async (setLoading) => {
    try {
      const q = query(boardsColRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const boards = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate().toLocaleString("en-US"),
      }));

      setBoards(boards);
    } catch (err) {
      setToastr("Error fetching boards");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return { createBoard, fetchBoards, fetchBoard, updateBoardData, deleteBoard };
};

export default useApp;
