import { useRef, useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../context";
import "./Canvas.scss";

export default function Canvas() {
  const {
    toolColor,
    toolSize,
    toolOpacity,
    backgroundColor,
    eraser,
    eraserSize,
    finalCanvasRef,
    showToolbar,
  } = useContext(AppContext);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finalCanvas = finalCanvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    finalCanvas.width = finalCanvas.offsetWidth;
    finalCanvas.height = finalCanvas.offsetHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.globalAlpha = eraser ? 1 : toolOpacity;
    ctx.strokeStyle = toolColor;
    ctx.lineWidth = eraser ? eraserSize : toolSize;
    ctx.imageSmoothingQuality = "high";
    ctxRef.current = ctx;
  }, [toolColor, toolOpacity, toolSize, eraser, eraserSize]);

  const getTouchPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      const pos = e.type.includes("touch")
        ? getTouchPos(e)
        : { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    },
    [getTouchPos]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) {
        return;
      }
      const pos = e.type.includes("touch")
        ? getTouchPos(e)
        : { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

      if (eraser) {
        const finalCtx = finalCanvasRef.current.getContext("2d");
        ctxRef.current.drawImage(finalCanvasRef.current, 0, 0);
        finalCtx.clearRect(0, 0, finalCtx.canvas.width, finalCtx.canvas.height);
        ctxRef.current.globalCompositeOperation = "destination-out";
      } else {
        ctxRef.current.globalCompositeOperation = "source-over";
        ctxRef.current.clearRect(
          0,
          0,
          ctxRef.current.canvas.width,
          ctxRef.current.canvas.height
        );
      }

      ctxRef.current.lineTo(pos.x, pos.y);
      ctxRef.current.stroke();
    },
    [isDrawing, getTouchPos, eraser, finalCanvasRef]
  );

  const finishDrawing = useCallback(() => {
    ctxRef.current.closePath();

    const finalCtx = finalCanvasRef.current.getContext("2d");
    finalCtx.drawImage(canvasRef.current, 0, 0);
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );

    if (eraser) {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

    setIsDrawing(false);
  }, [eraser, finalCanvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", finishDrawing, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", finishDrawing);
    };
  }, [startDrawing, draw, finishDrawing]);

  return (
    <div
      className={
        showToolbar
          ? "canvas_container"
          : "canvas_container canvas_container_full"
      }
      style={{}}
    >
      <div className="canvas_subContainer">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishDrawing}
          style={{
            width: 1280,
            height: 720,
            position: "absolute",
            zIndex: 2,
          }}
        />
        <canvas
          id="finalCanvas"
          ref={finalCanvasRef}
          style={{
            width: 1280,
            height: 720,
            position: "absolute",
            zIndex: 1,
            backgroundColor,
          }}
        />
      </div>
    </div>
  );
}
