export type TPosition = [number, number];

export interface IMapDTO {
  player: TPosition;
  enemies: TPosition[];
  obstacles: TPosition[];
  points: TPosition[];
}

export interface IDifficultySettings {
  obstaclesDiff: number;
  enemiesDiff: number;
  pointsNumber: number;
}
