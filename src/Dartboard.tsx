import React, { useMemo, useReducer } from "react";
import { computeValue } from "./calculator";
import { DartboardSvg } from "./DartboardSvg";
import { initialState, reducer } from "./reducer";
import SectionControls from "./SectionControls";

const Dartboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  function onWedgeSectionClick(
    number: number,
    section: "double" | "outer" | "triple" | "inner"
  ) {
    dispatch({
      type: "TOGGLE_SECTION",
      payload: { number, section },
    });
  }

  const handleNextOperator = (
    section: "double" | "outer" | "triple" | "inner"
  ) => {
    dispatch({
      type: "NEXT_SECTION_OPERATOR",
      payload: { section },
    });
  };

  const handlePreviousOperator = (
    section: "double" | "outer" | "triple" | "inner"
  ) => {
    dispatch({
      type: "PREVIOUS_SECTION_OPERATOR",
      payload: { section },
    });
  };
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
    return computeValue(state);
  }, [state]);
  return (
    <div>
      <h1 className="h1">Value: {value}</h1>
      <div className="flex items-center">
        <DartboardSvg
          state={state}
          onWedgeSectionClick={onWedgeSectionClick}
          onCenterClick={onCenterClick}
          onCenterRingClick={onCenterRingClick}
        />
        <SectionControls
          state={state}
          onNextOperator={handleNextOperator}
          onPreviousOperator={handlePreviousOperator}
          onClear={() => dispatch({ type: "CLEAR" })}
        />
      </div>
    </div>
  );
};

export default Dartboard;
