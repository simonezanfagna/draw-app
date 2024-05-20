import { createContext, useEffect, useRef, useState } from "react";
import customFetch from "./utils/axios";

export const AppContext = createContext();

export default function ContextAPI({ children }) {
  const [toolColor, setToolColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [toolSize, setToolSize] = useState(5);
  const [toolOpacity, setToolOpacity] = useState(1);
  const [eraserSize, setEraserSize] = useState(5);
  const [eraser, setEraser] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDrawing, setIsSavingDrawing] = useState(false);
  const [isGettingUser, setIsGettingUser] = useState(true);
  const [isLoadingDrawings, setIsLoadingDrawings] = useState(true);

  const finalCanvasRef = useRef(null);

  /* USER */

  useEffect(() => {
    (async () => {
      try {
        const resp = await customFetch.get("/@me");
        setUser(resp.data.user);

        /* console.log("Success:", resp.data); */
      } catch (error) {
        console.log(error.response.data.message);
      } finally {
        setIsGettingUser(false);
      }
    })();
  }, []);

  const loginUser = async (user, url) => {
    setIsLoading(true);

    try {
      const resp = await customFetch.post(url, user);
      setUser(resp.data.user);
      /* console.log("Success:", resp.data); */
      setIsLoading(false);
      return resp.data;
    } catch (error) {
      setIsLoading(false);

      return alert(error.response.data.message);
    }
  };

  const registerUser = async (user, url) => {
    setIsLoading(true);

    try {
      const resp = await customFetch.post(url, user);
      setUser(resp.data.user);

      /* console.log("Success:", resp.data); */
      setIsLoading(false);

      return resp.data;
    } catch (error) {
      setIsLoading(false);

      return alert(error.response.data.message);
    }
  };

  const logoutUser = async (url) => {
    try {
      const resp = await customFetch.post(url);
      setDrawings([]);
      setUser(null);

      return resp.data;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* DRAWING */

  const saveDrawing = async (image, url) => {
    setIsSavingDrawing(true);

    try {
      const resp = await customFetch.post(url, image);
      setIsSavingDrawing(false);

      alert(resp.data.message);
      /* console.log("Success:", resp.data); */
      return resp.data;
    } catch (error) {
      if (error.response.status === 401) {
        console.log(error.response);
        setUser(null);
        setIsSavingDrawing(false);
      } else {
        setIsSavingDrawing(false);
        alert(error.response.data.message);
      }
    }
  };

  const getDrawings = async (url) => {
    setIsLoadingDrawings(true);
    try {
      const resp = await customFetch.get(url);
      setDrawings(resp.data);
      /* console.log(resp.data); */
      return resp.data;
    } catch (error) {
      console.log(error.response);
      setDrawings([]);
    } finally {
      setIsLoadingDrawings(false);
    }
  };

  const clearCanvas = () => {
    const finalCanvas = finalCanvasRef.current;
    const finalCtx = finalCanvas.getContext("2d");
    finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
  };

  const deleteDrawing = async (drawing, url) => {
    try {
      const resp = await customFetch.post(url, drawing);
      alert(resp.data.message);
      getDrawings("/getAllDrawings");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const downloadDrawing = async (drawingId) => {
    try {
      const url = `/downloadDrawing/${drawingId}`;
      const response = await customFetch.get(url);
      const { data, filename } = response.data;
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${data}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download drawing: " + error.response.data.message);
    }
  };

  const value = {
    toolColor,
    setToolColor,
    backgroundColor,
    setBackgroundColor,
    toolSize,
    setToolSize,
    toolOpacity,
    setToolOpacity,
    eraserSize,
    setEraserSize,
    eraser,
    setEraser,
    user,
    setUser,
    loginUser,
    registerUser,
    saveDrawing,
    logoutUser,
    drawings,
    getDrawings,
    clearCanvas,
    finalCanvasRef,
    deleteDrawing,
    downloadDrawing,
    setShowToolbar,
    showToolbar,
    isLoading,
    setIsLoading,
    isGettingUser,
    isLoadingDrawings,
    setIsLoadingDrawings,
    isSavingDrawing,
    setIsSavingDrawing,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
