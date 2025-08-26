import type { IDifficultySettings, TPosition } from "../types/map.js";

export const DEFAULT_DIFFICULTY: IDifficultySettings = {
  obstaclesDiff: 7,
  enemiesDiff: 1,
  pointsNumber: 3,
};

export const GRID_SIZE = 9;
export const OBSTACLE_COUNT = 6;
export const POINT_COUNT = 2;
export const ENEMY_COUNT = 1;

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
