import { Component } from './Component';

interface NumericComponent extends Component {
  advance: () => void;
  stepBack: () => void;
  getCurrentNumber: () => number;
  getCurrentIndex: () => number;
  getLocalPosition: (ctx: CanvasRenderingContext2D, index: number) => { x: number, y: number };
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

  const getLocalPosition = (ctx: CanvasRenderingContext2D, index: number) => {
    let text = '[';
    for (let i = 0; i < index; i++) {
      text += numbers[i] + ', ';
    }
    text += numbers[index];
    const width = ctx.measureText(text).width;
    return { x: width, y: 30 };
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(globalX, globalY - 20, 800, 50); // Clear the area before drawing
    ctx.font = "16px Arial";
    let listText = '[';
    let offsetX = globalX;
    const offsetY = globalY + 10; // Adjust this value to move the list down
    ctx.fillText('[', offsetX, offsetY);
    offsetX += ctx.measureText('[').width;
  
    numbers.forEach((num, index) => {
      const numText = num.toString();
      if (index === currentIndex) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.fillText(numText, offsetX, offsetY);
      offsetX += ctx.measureText(numText).width;
  
      if (index < numbers.length - 1) {
        ctx.fillStyle = 'black';
        ctx.fillText(', ', offsetX, offsetY);
        offsetX += ctx.measureText(', ').width;
      }
    });
  
    ctx.fillStyle = 'black';
    ctx.fillText(']', offsetX, offsetY);
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
    getCurrentIndex,
    getLocalPosition,
    updateGlobalPosition,
    getGlobalPosition,
    logPositions
  };
};

export { createNumericComponent };
export type { NumericComponent };
