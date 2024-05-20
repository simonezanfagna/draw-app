import { useContext } from "react";
import "./Toolbar.scss";
import { AppContext } from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faEraser,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Toolbar() {
  const {
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
    saveDrawing,
    clearCanvas,
    setShowToolbar,
    showToolbar,
    isSavingDrawing,
  } = useContext(AppContext);

  function handleSaveDrawing() {
    const canvas = document.querySelector("#finalCanvas");
    const imageData = canvas.toDataURL("image/png");

    saveDrawing(
      { image: imageData, backgroundColor: backgroundColor },
      "/addDrawing"
    );
  }

  const handleColor = (color) => {
    if (color === "white") {
      setBackgroundColor("white");
      setToolColor("black");
    } else {
      setBackgroundColor("black");
      setToolColor("white");
    }
  };

  return (
    <div
      className={
        showToolbar ? "toolbar_container toolbar_active" : "toolbar_container"
      }
    >
      <FontAwesomeIcon
        icon={faAnglesLeft}
        onClick={() => setShowToolbar(false)}
        className="closeToolbarIcon"
      />
      <div className="setting">
        <label>Background Color:</label>
        <div>
          <button
            className={
              backgroundColor === "white"
                ? "btn_white btn_white_active"
                : "btn_white"
            }
            onClick={() => handleColor("white")}
          >
            White
          </button>
          <button
            className={
              backgroundColor === "black"
                ? "btn_black btn_black_active"
                : "btn_black"
            }
            onClick={() => handleColor("black")}
          >
            Black
          </button>
        </div>
      </div>
      <div className="setting">
        <label>Tool Color:</label>
        <div>
          {backgroundColor === "black" && (
            <button
              className="btn_white btn_white_active"
              onClick={() => setToolColor("white")}
            >
              White
            </button>
          )}
          {backgroundColor === "white" && (
            <button
              className="btn_black btn_black_active"
              onClick={() => setToolColor("black")}
            >
              Black
            </button>
          )}
        </div>
      </div>

      <div className="setting">
        <label>Tool Size:</label>
        <div>
          <p>{toolSize}</p>
          <input
            className="setting_range"
            type="range"
            min="1"
            max="20"
            value={toolSize}
            onChange={(e) => setToolSize(e.target.value)}
          />
        </div>
      </div>
      <div className="setting">
        <label>Tool Opacity:</label>
        <div>
          <p>{toolOpacity}</p>
          <input
            className="setting_range"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={toolOpacity}
            onChange={(e) => setToolOpacity(e.target.value)}
          />
        </div>
      </div>
      <div className="setting">
        <label>Eraser:</label>
        <div>
          <p>{eraserSize}</p>
          <input
            className="setting_range"
            type="range"
            min="1"
            max="20"
            value={eraserSize}
            onChange={(e) => setEraserSize(e.target.value)}
          />
          <button
            className={
              eraser
                ? "btn_eraser btn_black btn_black_active"
                : "btn_eraser btn_black"
            }
            onClick={() => setEraser(!eraser)}
          >
            <FontAwesomeIcon icon={faEraser} />
          </button>
        </div>
      </div>
      <div className="setting">
        <label>Delete:</label>
        <div>
          <button className="btn_black" onClick={clearCanvas}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      <div className="setting setting_save">
        <button
          className="btn_white btn_save"
          onClick={handleSaveDrawing}
          disabled={isSavingDrawing}
        >
          Save The Drawing
        </button>
      </div>
    </div>
  );
}
