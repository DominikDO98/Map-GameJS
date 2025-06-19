import { TPosition } from "types/map";

export const GRID_SIZE = 9;
export const OBSTACLE_COUNT = 7;
export const POINT_COUNT = 3;
export const ENEMY_COUNT = 2;

interface IMovemant {
  up: TPosition;
  down: TPosition;
  left: TPosition;
  right: TPosition;
}

export const movement: IMovemant = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
