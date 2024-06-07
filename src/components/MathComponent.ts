import { Component, createComponent } from './Component';

export interface MathComponent extends Component {
  updateNumber(number: number): void;
  getNumberPosition(): { x: number; y: number };
  getCurrentResult(): number;
}

export const createMathComponent = (x: number, y: number, targetNumber: number): MathComponent => {
  let currentNumber = 0;
  let result = 0;

  const drawFunc = (ctx: CanvasRenderingContext2D): void => {
    ctx.clearRect(x, y, 200, 50); // Clear previous state
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - 10, y - 30, 200, 50); // Draw box
    ctx.fillStyle = 'black';
    ctx.fillText(`Target - ${currentNumber} = ${result}`, x, y);
  };

  const logPositionsFunc = (): void => {
    console.log(`Math Component Updated with Current Number: ${currentNumber}`);
  };

  const updateNumber = (number: number): void => {
    currentNumber = number;
    result = targetNumber - currentNumber;
    logPositionsFunc();
  };

  const getNumberPosition = (): { x: number; y: number } => ({
    x: 90, // Assuming the number is at the center horizontally
    y: 10, // Adjusted to the position of the text
  });

  const getCurrentResult = (): number => result;

  const component = createComponent('math', x, y, drawFunc, logPositionsFunc);

  return { ...component, updateNumber, getNumberPosition, getCurrentResult };
};
