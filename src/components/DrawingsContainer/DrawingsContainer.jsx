import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./DrawingsContainer.scss";
import { useContext } from "react";
import { AppContext } from "../../context";

export default function DrawingsContainer({ drawings }) {
  const { deleteDrawing, downloadDrawing, isLoadingDrawings } =
    useContext(AppContext);

  if (isLoadingDrawings) {
    return (
      <div className="drawings_container empty">
        <p>Loading...</p>
      </div>
    );
  }

  if (drawings.length === 0) {
    return (
      <div className="drawings_container empty">
        <p>no drawings to show</p>
      </div>
    );
  }
  return (
    <div className="drawings_container">
      {drawings.map((drawing) => (
        <div className="img_container" key={drawing.id}>
          <img src={drawing.image_data} alt="Drawing" />
          <button
            className="delete_drawing btn_white"
            onClick={() => deleteDrawing({ id: drawing.id }, "/deleteDrawing")}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            className="download_drawing btn_white"
            onClick={() => downloadDrawing(drawing.id)}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      ))}
    </div>
  );
}
