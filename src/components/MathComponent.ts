import { Component } from './Component';

interface MathComponent extends Component {
  updateNumber: (num: number) => void;
  getCurrentResult: () => number;
  getNumberPosition: () => { x: number; y: number };
  showCalculation: (show: boolean) => void;
}

const createMathComponent = (x: number, y: number, target: number): MathComponent => {
  let globalX = x;
  let globalY = y;
  let currentNumber = 0;
  let showCalc = false;

  const updateNumber = (num: number) => {
    currentNumber = num;
  };

  const getCurrentResult = () => {
    return target - currentNumber;
  };

  const getNumberPosition = () => {
    return { x: 40, y: 20 };
  };

  const showCalculation = (show: boolean) => {
    showCalc = show;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(globalX, globalY, 150, 50);
    if (showCalc) {
      ctx.fillStyle = 'black';
      ctx.fillText('Target - Current Number = Complement', globalX + 10, globalY + 20);
      ctx.fillText(`${target} - ${currentNumber} = ${getCurrentResult()}`, globalX + 10, globalY + 40);
    }
  };

  const updateGlobalPosition = (newX: number, newY: number) => {
    globalX = newX;
    globalY = newY;
  };

  const getGlobalPosition = () => {
    return { x: globalX, y: globalY };
  };

  const logPositions = () => {
    console.log(`Math Component Global Position: (${globalX}, ${globalY})`);
  };

  return {
    type: 'math',
    draw,
    updateNumber,
    getCurrentResult,
    getNumberPosition,
    showCalculation,
    updateGlobalPosition,
    getGlobalPosition,
    logPositions
  };
};

export { createMathComponent };    export type { MathComponent };

