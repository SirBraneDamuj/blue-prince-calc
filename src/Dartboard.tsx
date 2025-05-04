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
  function onCenterClick() {
    dispatch({
      type: "NEXT_CENTER_OPERATOR",
    });
  }
  function onCenterRingClick() {
    dispatch({
      type: "NEXT_CENTER_WEDGE_OPERATOR",
    });
  }
  return (
    <div>
      <DartboardSvg
        wedges={wedges}
        center={center}
        onWedgeSectionClick={onWedgeSectionClick}
        onCenterClick={onCenterClick}
        onCenterRingClick={onCenterRingClick}
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
