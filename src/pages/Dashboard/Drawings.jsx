import { useContext, useEffect } from "react";
import DrawingsContainer from "../../components/DrawingsContainer/DrawingsContainer";
import { AppContext } from "../../context";

export default function Drawings() {
  const { getDrawings, drawings } = useContext(AppContext);
  useEffect(() => {
    getDrawings("/getAllDrawings");
  }, []);

  return (
    <div className="drawings">
      <DrawingsContainer drawings={drawings} />
    </div>
  );
}
