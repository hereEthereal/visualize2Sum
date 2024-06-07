export type KeyPosition = { x: number; y: number } | null;

export interface Component {
  type: string;
  draw(ctx: CanvasRenderingContext2D): void;
  updateGlobalPosition(x: number, y: number): void;
  getGlobalPosition(): { x: number; y: number };
  logPositions(): void;
}

export const createComponent = (
  type: string,
  x: number,
  y: number,
  drawFunc: (ctx: CanvasRenderingContext2D) => void,
  logPositionsFunc: () => void
): Component => {
  let globalX = x;
  let globalY = y;

  const draw = (ctx: CanvasRenderingContext2D): void => {
    drawFunc(ctx);
  };

  const updateGlobalPosition = (x: number, y: number): void => {
    globalX = x;
    globalY = y;
    console.log(`${type} Component Global Position Updated: (${globalX}, ${globalY})`);
  };

  const getGlobalPosition = (): { x: number; y: number } => ({
    x: globalX,
    y: globalY,
  });

  const logPositions = (): void => {
    logPositionsFunc();
  };

  return { type, draw, updateGlobalPosition, getGlobalPosition, logPositions };
};
