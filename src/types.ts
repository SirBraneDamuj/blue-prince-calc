export type WedgeSection = "double" | "outer" | "triple" | "inner";
export type WedgeOperator = "add" | "subtract" | "multiply" | "divide";
export type CenterOperator = "square" | "flip" | "round1" | "round2" | "round3";

export type Section =
  | {
      type: WedgeSection;
      numbers: null;
      operator: null;
    }
  | {
      type: WedgeSection;
      numbers: Set<number>;
      operator: WedgeOperator | null;
    };

export type Wedge = {
  [key in WedgeSection]: WedgeOperator | null;
};

export type Center = {
  operator: CenterOperator;
  wedgeOperator: WedgeOperator;
};
