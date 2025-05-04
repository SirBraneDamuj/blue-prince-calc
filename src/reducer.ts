import {
  Center,
  CenterOperator,
  Wedge,
  WedgeOperator,
  WedgeSection,
} from "./types";

export type DartboardState = {
  wedges: Wedge[];
  center: Center | null;
};

export const initialState = {
  wedges: Array.from({ length: 20 }, () => ({
    double: null,
    outer: null,
    triple: null,
    inner: null,
  })),
  center: null,
};

type WedgeOperatorCycleActions =
  | {
      type: "NEXT_WEDGE_OPERATOR";
      payload: {
        wedgeNumber: number;
        wedgeSection: WedgeSection;
      };
    }
  | {
      type: "PREVIOUS_WEDGE_OPERATOR";
      payload: {
        wedgeNumber: number;
        wedgeSection: WedgeSection;
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
  | WedgeOperatorCycleActions
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
  action: WedgeOperatorCycleActions
): DartboardState {
  const newWedgeOperatorFn =
    action.type === "NEXT_WEDGE_OPERATOR"
      ? nextWedgeOperator
      : previousWedgeOperator;
  return {
    ...state,
    wedges: state.wedges.map((wedge, index) => {
      if (index === action.payload.wedgeNumber) {
        const newWedge = { ...wedge };
        newWedge[action.payload.wedgeSection] = newWedgeOperatorFn(
          wedge[action.payload.wedgeSection]
        );
        return newWedge;
      }
      return wedge;
    }),
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
    case "NEXT_WEDGE_OPERATOR":
    case "PREVIOUS_WEDGE_OPERATOR":
      return handleWedgeOperatorCycleAction(state, action);
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
