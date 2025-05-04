import { DartboardState } from "./reducer";
import { WedgeOperator, WedgeSection } from "./types";

export function computeValue(state: DartboardState): number {
  const sectionOrder: WedgeSection[] = ["inner", "triple", "outer", "double"];
  let currentValue = 0;

  for (const section of sectionOrder) {
    let sectionOperator: WedgeOperator | null = null;
    for (let i = 0; i < state.wedges.length; i++) {
      const wedge = state.wedges[i];
      const wedgeNumber = i + 1;
      if (wedge[section]) {
        console.log(i, wedgeNumber, section, wedge[section]);
        if (sectionOperator !== null && wedge[section] !== sectionOperator) {
          throw new Error("Inconsistent wedge operators");
        } else {
          sectionOperator = wedge[section];
        }
        switch (wedge[section]) {
          case "add":
            currentValue += i + 1;
            break;
          case "subtract":
            currentValue -= wedgeNumber;
            break;
          case "multiply":
            currentValue *= wedgeNumber;
            break;
          case "divide":
            if (wedgeNumber !== 0) {
              currentValue /= wedgeNumber;
            }
            break;
        }
      }
    }
    if (state.center) {
      if (state.center.wedgeOperator === sectionOperator) {
        switch (state.center.operator) {
          case "square":
            currentValue = Math.pow(currentValue, 2);
            break;
          case "flip":
            currentValue = parseFloat(
              currentValue.toString().split("").reverse().join("")
            );
            break;
          case "round1":
            currentValue = Math.round(currentValue);
            break;
          case "round2":
            currentValue = Math.round(currentValue / 10) * 10;
            break;
          case "round3":
            currentValue = Math.round(currentValue / 100) * 100;
            break;
        }
      }
    }
  }

  return currentValue;
}
