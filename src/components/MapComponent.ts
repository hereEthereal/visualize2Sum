import { Component } from './Component';

export interface MapComponent extends Component {
  addPair: (key: string, value: number) => void;
  getKeyPosition: (key: string) => { x: number, y: number } | null;
  getNextKeyPosition: () => number;
  hasKey: (key: string) => boolean; // Add this method
}

export const createMapComponent = (x: number, y: number): MapComponent => {
  const keyValuePairs = new Map<string, number>();

  let globalX = x;
  let globalY = y;

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(globalX, globalY, 200, 200);
    let index = 0;
    for (const [key, value] of keyValuePairs.entries()) {
      ctx.fillText(`${key}: ${value}`, globalX + 10, globalY + (index * 20) + 20);
      index++;
    }
  };

  const addPair = (key: string, value: number) => {
    keyValuePairs.set(key, value);
  };

  const getKeyPosition = (key: string) => {
    let index = 0;
    for (const k of keyValuePairs.keys()) {
      if (k === key) {
        return { x: globalX + 10, y: globalY + (index * 20) + 20 };
      }
      index++;
    }
    return null;
  };

  const getNextKeyPosition = () => keyValuePairs.size; // Returns the next position index

  const hasKey = (key: string) => keyValuePairs.has(key); // Implement the hasKey method

  const updateGlobalPosition = (x: number, y: number) => {
    globalX = x;
    globalY = y;
  };

  const getGlobalPosition = () => ({ x: globalX, y: globalY });

  return {
    type: 'map',
    draw,
    addPair,
    getKeyPosition,
    getNextKeyPosition,
    hasKey, // Add this method to the return object
    updateGlobalPosition,
    getGlobalPosition,
    logPositions: () => {
      console.log(`Map Component Global Position: (${globalX}, ${globalY})`);
    }
  };
};
