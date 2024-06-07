import { Component, createComponent, KeyPosition } from './Component';

export interface MapComponent extends Component {
  addPair(key: string, value: number): void;
  getKeyPosition(key: string): KeyPosition;
  hasKey(key: string): boolean;
}

export const createMapComponent = (x: number, y: number): MapComponent => {
  const keyValuePairs = new Map<string, number>();

  const drawFunc = (ctx: CanvasRenderingContext2D): void => {
    const boxWidth = 200;
    const boxHeight = 150;
    ctx.clearRect(x, y, boxWidth, boxHeight); // Clear previous state
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - 10, y - 30, boxWidth + 20, boxHeight + 20); // Draw box

    let index = 0;
    keyValuePairs.forEach((value, key) => {
      const yOffset = y + index * 20;
      ctx.fillStyle = 'black';
      ctx.fillText(`${key}: ${value}`, x, yOffset);
      index++;
    });
  };

  const logPositionsFunc = (): void => {
    keyValuePairs.forEach((value, key) => {
      const pos = getKeyPosition(key);
      if (pos) {
        console.log(`Map Component Key Position: ${key} (${pos.x}, ${pos.y})`);
      }
    });
  };

  const addPair = (key: string, value: number): void => {
    keyValuePairs.set(key, value);
    logPositionsFunc();
  };

  const getKeyPosition = (key: string): KeyPosition => {
    let index = 0;
    if (keyValuePairs.has(key)) {
      for (let k of keyValuePairs.keys()) {
        if (k === key) break;
        index++;
      }
      return {
        x,
        y: y + index * 20,
      };
    }
    return null;
  };

  const hasKey = (key: string): boolean => keyValuePairs.has(key);

  const component = createComponent('map', x, y, drawFunc, logPositionsFunc);

  return { ...component, addPair, getKeyPosition, hasKey };
};
