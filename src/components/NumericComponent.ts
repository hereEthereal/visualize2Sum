import { Component, createComponent } from './Component';

export interface NumericComponent extends Component {
  advance(): void;
  stepBack(): void;
  getCurrentNumber(): number;
  getLocalPosition(): { x: number; y: number };
}

export const createNumericComponent = (numbers: number[], x: number, y: number): NumericComponent => {
  let currentIndex = 0;

  const drawFunc = (ctx: CanvasRenderingContext2D): void => {
    const boxWidth = 30 * numbers.length;
    const boxHeight = 50;
    ctx.clearRect(x, y, boxWidth, boxHeight); // Clear previous state
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - 10, y - 30, boxWidth + 20, boxHeight + 20); // Draw box
    numbers.forEach((num, index) => {
      ctx.fillStyle = index === currentIndex ? 'red' : 'black';
      ctx.fillText(num.toString(), x + index * 30, y);
    });
  };

  const logPositionsFunc = (): void => {
    const localPos = getLocalPosition();
    const globalPos = component.getGlobalPosition();
    console.log(`Numeric Component Local Position: (${localPos.x}, ${localPos.y})`);
    console.log(`Numeric Component Global Position: (${globalPos.x}, ${globalPos.y})`);
  };

  const advance = (): void => {
    if (currentIndex < numbers.length - 1) {
      currentIndex++;
      logPositionsFunc();
    }
  };

  const stepBack = (): void => {
    if (currentIndex > 0) {
      currentIndex--;
      logPositionsFunc();
    }
  };

  const getCurrentNumber = (): number => numbers[currentIndex];

  const getLocalPosition = (): { x: number; y: number } => ({
    x: currentIndex * 30,
    y: 0,
  });

  const component = createComponent('numeric', x, y, drawFunc, logPositionsFunc);

  return { ...component, advance, stepBack, getCurrentNumber, getLocalPosition };
};
