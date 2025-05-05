import React from "react";
import { DartboardState } from "./reducer";
import { WedgeSection } from "./types";

type SectionControlsProps = {
  state: DartboardState;
  onNextOperator: (section: WedgeSection) => void;
  onPreviousOperator: (section: WedgeSection) => void;
  onClear: () => void;
};

const SectionControls: React.FC<SectionControlsProps> = ({
  state,
  onNextOperator,
  onPreviousOperator,
  onClear,
}) => {
  const sectionTypes: WedgeSection[] = ["double", "outer", "triple", "inner"];

  return (
    <div className="flex-2 flex-col">
      {sectionTypes.map((section) => (
        <div key={section} className="flex">
          <div className={"flex-2"}>
            <button
              className={"btn"}
              onClick={() => onPreviousOperator(section)}
            >
              {"<-"}
            </button>
          </div>
          <div className={"flex-1/12"}>
            {section} | {state.sections[section].operator}
          </div>
          <div className={"flex-2"}>
            <button className={"btn"} onClick={() => onNextOperator(section)}>
              {"->"}
            </button>
          </div>
        </div>
      ))}
      <div className="flex-1">
        <button className={"btn"} onClick={() => onClear()}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SectionControls;
