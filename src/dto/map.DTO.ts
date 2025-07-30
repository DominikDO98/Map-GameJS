import type { IMapDTO, TPosition } from "../types/map.js";

export class MapDTO implements IMapDTO {
  obstacles: TPosition[];
  points: TPosition[];
  player: TPosition;
  enemies: TPosition[];

  constructor(
    player: TPosition,
    obstacles: TPosition[],
    points: TPosition[],
    enemies: TPosition[]
  ) {
    this.player = player;
    this.enemies = enemies;
    this.obstacles = obstacles;
    this.points = points;
  }
}
