import {
  Center,
  CenterOperator,
  Section,
  WedgeOperator,
  WedgeSection,
} from "./types";

export type DartboardState = {
  sections: {
    [key in WedgeSection]: Section;
  };
  center: Center | null;
};

export const initialState: DartboardState = {
  sections: {
    double: { type: "double", numbers: new Set(), operator: null },
    outer: { type: "outer", numbers: new Set(), operator: null },
    triple: { type: "triple", numbers: new Set(), operator: null },
    inner: { type: "inner", numbers: new Set(), operator: null },
  },
  center: null,
};

type SectionOperatorCycleActions = {
  type: "NEXT_SECTION_OPERATOR" | "PREVIOUS_SECTION_OPERATOR";
  payload: {
    section: WedgeSection;
  };
};

type ToggleSectionAction = {
  type: "TOGGLE_SECTION";
  payload: {
    section: WedgeSection;
    number: number;
  };
};

type ClearAction = {
  type: "CLEAR";
};

type CenterOperatorCycleActions = {
  type: "NEXT_CENTER_OPERATOR" | "PREVIOUS_CENTER_OPERATOR";
};

type CenterWedgeOperatorCycleActions = {
  type: "NEXT_CENTER_WEDGE_OPERATOR" | "PREVIOUS_CENTER_WEDGE_OPERATOR";
};

export type Actions =
  | SectionOperatorCycleActions
  | ToggleSectionAction
  | ClearAction
  | CenterOperatorCycleActions
  | CenterWedgeOperatorCycleActions;

function nextWedgeOperator(
  currentOperator: WedgeOperator | null
): WedgeOperator | null {
  switch (currentOperator) {
    case "add":
      return "subtract";
    case "subtract":
      return "multiply";
    case "multiply":
      return "divide";
    case "divide":
      return null;
    default:
      return "add";
  }
}

function previousWedgeOperator(
  currentOperator: WedgeOperator | null
): WedgeOperator | null {
  switch (currentOperator) {
    case "add":
      return null;
    case "subtract":
      return "add";
    case "multiply":
      return "subtract";
    case "divide":
      return "multiply";
    default:
      return null;
  }
}

function nextCenterOperator(
  currentOperator: CenterOperator | null
): CenterOperator | null {
  switch (currentOperator) {
    case "square":
      return "flip";
    case "flip":
      return "round1";
    case "round1":
      return "round2";
    case "round2":
      return "round3";
    case "round3":
      return null;
    default:
      return "square";
  }
}

function previousCenterOperator(
  currentOperator: CenterOperator | null
): CenterOperator | null {
  switch (currentOperator) {
    case "square":
      return null;
    case "flip":
      return "square";
    case "round1":
      return "flip";
    case "round2":
      return "round1";
    case "round3":
      return "round2";
    default:
      return null;
  }
}

function handleWedgeOperatorCycleAction(
  state: DartboardState,
  action: SectionOperatorCycleActions
): DartboardState {
  const newWedgeOperatorFn =
    action.type === "NEXT_SECTION_OPERATOR"
      ? nextWedgeOperator
      : previousWedgeOperator;
  const currentSection = state.sections[action.payload.section];
  const newWedgeOperator = newWedgeOperatorFn(currentSection.operator);
  const newSection = {
    ...currentSection,
    operator: newWedgeOperator,
  };
  return {
    ...state,
    sections: {
      ...state.sections,
      [action.payload.section]: newSection,
    },
  };
}

function handleToggleSectionAction(
  state: DartboardState,
  action: ToggleSectionAction
): DartboardState {
  const { section, number } = action.payload;
  const currentSection = state.sections[section];
  const newNumbers = new Set(currentSection.numbers);

  if (newNumbers.has(number)) {
    newNumbers.delete(number);
  } else {
    newNumbers.add(number);
  }

  const newSection = {
    ...currentSection,
    numbers: newNumbers,
    operator: currentSection.operator || "add",
  };

  return {
    ...state,
    sections: {
      ...state.sections,
      [section]: newSection,
    },
  };
}

function handleCenterOperatorCycleAction(
  state: DartboardState,
  action: CenterOperatorCycleActions
): DartboardState {
  const newCenterOperatorFn =
    action.type === "NEXT_CENTER_OPERATOR"
      ? nextCenterOperator
      : previousCenterOperator;
  const newCenterOperator = newCenterOperatorFn(state.center?.operator || null);
  if (newCenterOperator === null) {
    return {
      ...state,
      center: null,
    };
  }
  const newCenter = {
    ...(state.center || {}),
    operator: newCenterOperator,
    wedgeOperator: state.center ? state.center.wedgeOperator : "add",
  };
  return {
    ...state,
    center: newCenter,
  };
}

function handleCenterWedgeOperatorCycleAction(
  state: DartboardState,
  action: CenterWedgeOperatorCycleActions
): DartboardState {
  const newWedgeOperatorFn =
    action.type === "NEXT_CENTER_WEDGE_OPERATOR"
      ? nextWedgeOperator
      : previousWedgeOperator;
  const possibleNewWedgeOperator = newWedgeOperatorFn(
    state.center?.wedgeOperator || null
  );
  const newWedgeOperator = possibleNewWedgeOperator
    ? possibleNewWedgeOperator
    : newWedgeOperatorFn(null);
  if (newWedgeOperator === null) {
    console.error(
      "Somehow we went from a null wedge operator to a null wedge operator. This shouldn't happen."
    );
  }
  const newCenter = {
    ...(state.center || {}),
    operator: state.center ? state.center.operator : "square",
    wedgeOperator: newWedgeOperator || "add",
  };
  return {
    ...state,
    center: newCenter,
  };
}

export const reducer = (state: DartboardState, action: Actions) => {
  switch (action.type) {
    case "NEXT_SECTION_OPERATOR":
    case "PREVIOUS_SECTION_OPERATOR":
      return handleWedgeOperatorCycleAction(state, action);
    case "TOGGLE_SECTION":
      return handleToggleSectionAction(state, action);
    case "NEXT_CENTER_OPERATOR":
    case "PREVIOUS_CENTER_OPERATOR":
      return handleCenterOperatorCycleAction(state, action);
    case "NEXT_CENTER_WEDGE_OPERATOR":
    case "PREVIOUS_CENTER_WEDGE_OPERATOR":
      return handleCenterWedgeOperatorCycleAction(state, action);
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
};
