import { logger } from "../../lib/logger/logger.js";
import { PathFinding } from "../utils/pathFinding.js";
import { GRID_SIZE } from "../constants/index.js";
import { MapDTO } from "../dto/map.DTO.js";
import type { IDifficultySettings, IMapDTO, TPosition } from "../types/map.js";

export class Map {
  private _occupied: Set<string> = new Set();
  private _obstecles: Set<string> = new Set();
  private _points: Set<string> = new Set();
  private _player: string | null = null;
  private _enemies: Set<string> = new Set();
  private _isGenerated: boolean = false;
  private _diff: IDifficultySettings;

  constructor(diff: IDifficultySettings) {
    this._diff = diff;
  }

  private convert(pos: string): TPosition {
    return pos.split(",").map(Number) as TPosition;
  }

  private convertMap(): IMapDTO {
    return {
      player: this.convert(this._player!),
      enemies: Array.from(this._enemies).map(this.convert),
      obstacles: Array.from(this._obstecles).map(this.convert),
      points: Array.from(this._points).map(this.convert),
    };
  }

  private checkPossiblePaths(posToCheck: string, goal: TPosition): boolean {
    const path = new PathFinding(this.convertMap()).findPath(
      this.convert(posToCheck),
      goal
    );
    if (!path[0]) return false;
    return path[0].length > 0;
  }

  private generateRandomPosition(maxX: number, maxY: number): string {
    return `${Math.floor(Math.random() * (maxY + 1))},${Math.floor(
      Math.random() * (maxX + 1)
    )}`;
  }

  private generatePlayer() {
    this._player = this.generateRandomPosition(3, 5);
    this._occupied.add(this._player);
  }

  private removeArrFromSet(set: Set<string>, arr: Set<string>) {
    arr.forEach((pos) => {
      set.delete(pos);
    });
  }

  private generateEnemies() {
    while (this._enemies.size < this._diff.enemiesDiff) {
      const pos = `${Math.floor(
        Math.random() * (GRID_SIZE - (GRID_SIZE - 5)) + (GRID_SIZE - 5)
      )},${Math.floor(
        Math.random() * (GRID_SIZE - (GRID_SIZE - 3)) + (GRID_SIZE - 3)
      )}`;
      if (this._occupied.has(pos)) continue;
      if (this.convert(pos)[0] < 3 && this.convert(pos)[1] < 5) continue;
      this._occupied.add(pos);
      this._enemies.add(pos);
    }
  }

  private generateObstecles() {
    let iterations = 0;
    while (this._obstecles.size < this._diff.obstaclesDiff) {
      const pos = this.generateRandomPosition(GRID_SIZE, GRID_SIZE);
      if (this._occupied.has(pos)) continue;
      if (this.convert(pos)[0] < 5 && this.convert(pos)[1] < 3) continue;
      if (
        this.convert(pos)[0] > GRID_SIZE - 6 &&
        this.convert(pos)[1] > GRID_SIZE - 4
      )
        continue;
      this._occupied.add(pos);
      this._obstecles.add(pos);
      const path = new PathFinding(this.convertMap()).findPath(
        this.convert(this._player!),
        [9, 9]
      );
      console.log(path);
      console.log(this.checkPossiblePaths(this._player!, [9, 9]));

      if (!path[0]) {
        iterations++;
        logger.warn(
          `Obstacle at ${pos} blocked the path, removing and retrying...`,
          "Map Generation",
          false
        );
        this.removeArrFromSet(this._occupied, this._obstecles);
        this._obstecles.clear();
      }
      if (iterations >= 100) {
        throw new Error("Failed to generate obstacles after 100 iterations");
      }
    }
  }

  private generatePoints() {
    while (this._points.size < this._diff.pointsNumber) {
      const pos = this.generateRandomPosition(GRID_SIZE, GRID_SIZE);
      if (this._occupied.has(pos)) continue;
      if (this.convert(pos)[0] < 5 && this.convert(pos)[1] < 3) continue;
      if (
        this.convert(pos)[0] > GRID_SIZE - 6 &&
        this.convert(pos)[1] > GRID_SIZE - 4
      )
        continue;
      if (!this.checkPossiblePaths(pos, this.convert(this._player!))) {
        logger.warn(
          "No path to player from point is available",
          "Map Generation",
          false
        );
        continue;
      }
      this._occupied.add(pos);
      this._points.add(pos);
    }
  }

  generate() {
    if (this._isGenerated) throw new Error("Map already generated!");
    this.generatePlayer();
    this.generateEnemies();
    this.generateObstecles();
    this.generatePoints();
    this._isGenerated = true;
    return this;
  }

  toDTO(): MapDTO {
    if (!this._isGenerated || !this._player)
      throw new Error("No player created!");
    const { player, obstacles, enemies, points } = this.convertMap();
    return new MapDTO(player, obstacles, points, enemies);
  }

  visualizeMap(): string {
    const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(".")
    );
    const [px, py] = this.convert(this._player!);
    grid[px]![py] = "P";

    this._enemies.forEach((pos) => {
      const [ex, ey] = this.convert(pos);
      grid[ex]![ey] = "E";
    });
    this._obstecles.forEach((pos) => {
      const [ox, oy] = this.convert(pos);
      grid[ox]![oy] = "O";
    });
    this._points.forEach((pos) => {
      const [px, py] = this.convert(pos);
      grid[px]![py] = "X";
    });

    return grid.map((row) => row.join(" ")).join("\n");
  }
}
