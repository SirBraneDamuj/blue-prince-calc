import React, { useReducer } from "react";
import { DartboardSvg } from "./DartboardSvg";
import { initialState, reducer } from "./reducer";

const Dartboard: React.FC = () => {
  const [{ wedges, center }, dispatch] = useReducer(reducer, initialState);
  function onWedgeSectionClick(
    wedgeNumber: number,
    wedgeSection: "double" | "outer" | "triple" | "inner"
  ) {
    dispatch({
      type: "NEXT_WEDGE_OPERATOR",
      payload: { wedgeNumber, wedgeSection },
    });
  }
  return (
    <div>
      <DartboardSvg
        wedges={wedges}
        center={center}
        onWedgeSectionClick={onWedgeSectionClick}
      />
      <br />
      <button
        onClick={() =>
          dispatch({
            type: "CLEAR",
          })
        }
      >
        Clear
      </button>
    </div>
  );
};

export default Dartboard;
