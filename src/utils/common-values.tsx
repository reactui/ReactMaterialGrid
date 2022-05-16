import { Size } from "@material-ui/core";

export const elementSize = (props: any): Size => 'medium';
  //props.options.padding === "default" ? "medium" : "small";
export const baseIconSize = (props: any) =>
  elementSize(props) === "medium" ? 48 : 32;
export const rowActions = (props: any) =>
  props.actions.filter(
    (a: any) => a.position === "row" || typeof a === "function"
  );
export const actionsColumnWidth = (props: any) =>
  rowActions(props).length * baseIconSize(props);
export const selectionMaxWidth = (props: any, maxTreeLevel: number) =>
  baseIconSize(props) + 9 * maxTreeLevel;

export const reducePercentsInCalc = (calc: any, fullValue: number) => {
  let index = calc.indexOf("%");
  let count = 0;
  while (index !== -1 && count++ < 30) {
    let leftIndex = index - 1;
    while (leftIndex >= 0 && "0123456789.".indexOf(calc[leftIndex]) !== -1) {
      leftIndex--;
    }
    leftIndex++;

    const value = Number.parseFloat(calc.substring(leftIndex, index));
    calc =
      calc.substring(0, leftIndex) +
      (value * fullValue) / 100 +
      "px" +
      calc.substring(index + 1);
    index = calc.indexOf("%");
  }

  return calc;
};
