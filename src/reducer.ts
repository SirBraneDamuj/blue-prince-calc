import { Center, Wedge, WedgeOperator, WedgeSection } from "./types";

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

export type Actions = WedgeOperatorCycleActions | ClearAction;

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

export const reducer = (state: DartboardState, action: Actions) => {
  switch (action.type) {
    case "NEXT_WEDGE_OPERATOR":
    case "PREVIOUS_WEDGE_OPERATOR":
      return handleWedgeOperatorCycleAction(state, action);
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
};
