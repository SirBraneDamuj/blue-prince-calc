import { DartboardState } from "./reducer";
import { WedgeSection } from "./types";

export function computeValue(state: DartboardState): number {
  const sectionOrder: WedgeSection[] = ["inner", "triple", "outer", "double"];
  const { sections, center } = state;
  let currentValue = 0;

  for (const section of sectionOrder) {
    const sectionOperator = sections[section].operator;
    if (sectionOperator === null) {
      continue;
    }
    for (const wedgeNumber of sections[section].numbers) {
      switch (sectionOperator) {
        case "add":
          currentValue += wedgeNumber;
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
    if (center) {
      if (center.wedgeOperator === sectionOperator) {
        switch (center.operator) {
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
