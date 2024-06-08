import { Component } from './Component';

interface NumericComponent extends Component {
  advance: () => void;
  stepBack: () => void;
  getCurrentNumber: () => number;
  getCurrentIndex: () => number; // Add this method
  getLocalPosition: () => { x: number, y: number }; // Add this method
}

const createNumericComponent = (numbers: number[], x: number, y: number): NumericComponent => {
  let globalX = x;
  let globalY = y;
  let currentIndex = 0;

  const advance = () => {
    if (currentIndex < numbers.length - 1) {
      currentIndex++;
    }
  };

  const stepBack = () => {
    if (currentIndex > 0) {
      currentIndex--;
    }
  };

  const getCurrentNumber = () => {
    return numbers[currentIndex];
  };

  const getCurrentIndex = () => {
    return currentIndex;
  };

  const getLocalPosition = () => {
    return { x: 20 * currentIndex + 10, y: 30 };
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(globalX, globalY, 150, 50);
    numbers.forEach((num, index) => {
      ctx.fillStyle = index === currentIndex ? 'red' : 'black';
      ctx.fillText(num.toString(), globalX + 20 * index + 10, globalY + 30);
    });
  };

  const updateGlobalPosition = (newX: number, newY: number) => {
    globalX = newX;
    globalY = newY;
  };

  const getGlobalPosition = () => {
    return { x: globalX, y: globalY };
  };

  const logPositions = () => {
    console.log(`Numeric Component Local Position: (${20 * currentIndex + 10}, 30)`);
    console.log(`Numeric Component Global Position: (${globalX}, ${globalY})`);
  };

  return {
    type: 'numeric',
    draw,
    advance,
    stepBack,
    getCurrentNumber,
    getCurrentIndex, // Ensure this is included in the return object
    getLocalPosition, // Ensure this is included in the return object
    updateGlobalPosition,
    getGlobalPosition,
    logPositions
  };
};

export { createNumericComponent };    export type { NumericComponent };

