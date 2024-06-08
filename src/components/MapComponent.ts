import { Component } from './Component';

interface MapComponent extends Component {
  addPair: (key: string, value: number) => void;
  hasKey: (key: string) => boolean;
  getKeyPosition: (key: string) => { x: number, y: number } | null;
  getNextKeyPosition: () => number;
}

const createMapComponent = (x: number, y: number): MapComponent => {
  const keyValuePairs = new Map<string, number>();
  let globalX = x;
  let globalY = y;

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(globalX, globalY, 200, 100);
    let index = 0;
    for (const [key, value] of keyValuePairs) {
      ctx.fillStyle = 'black';
      ctx.fillText(`${key}: ${value}`, globalX + 10, globalY + 20 + index * 20);
      index++;
    }
  };

  const addPair = (key: string, value: number) => {
    keyValuePairs.set(key, value);
  };

  const hasKey = (key: string) => {
    return keyValuePairs.has(key);
  };

  const getKeyPosition = (key: string) => {
    let index = 0;
    if (keyValuePairs.has(key)) {
      for (const k of keyValuePairs.keys()) {
        if (k === key) break;
        index++;
      }
      return { x: globalX + 10, y: globalY + 20 + index * 20 };
    }
    return null;
  };

  const getNextKeyPosition = () => {
    return keyValuePairs.size;
  };

  const updateGlobalPosition = (newX: number, newY: number) => {
    globalX = newX;
    globalY = newY;
  };

  const getGlobalPosition = () => {
    return { x: globalX, y: globalY };
  };

  const logPositions = () => {
    console.log(`Map Component Global Position: (${globalX}, ${globalY})`);
  };

  return {
    type: 'map',
    draw,
    addPair,
    hasKey,
    getKeyPosition,
    getNextKeyPosition,
    updateGlobalPosition,
    getGlobalPosition,
    logPositions
  };
};

export { createMapComponent };    export type { MapComponent };

