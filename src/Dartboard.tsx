import React, { useMemo, useReducer } from "react";
import { computeValue } from "./calculator";
import { DartboardSvg } from "./DartboardSvg";
import { initialState, reducer } from "./reducer";

const Dartboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { wedges, center } = state;
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
  const value = useMemo(() => {
    try {
      return computeValue(state);
    } catch (error) {
      console.error("Error computing value:", error);
      return -1;
    }
  }, [state]);
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
      <h1>Value: {value}</h1>
    </div>
  );
};

export default Dartboard;
