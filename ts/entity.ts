export interface Entity {
  x: number;
  y: number;
  height: number;
  width: number;
  draw(ctx: CanvasRenderingContext2D): void;
}
