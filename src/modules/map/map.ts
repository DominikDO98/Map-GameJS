import { IMap, TPosition, TPositionSet } from "../../types/map.js";

export class Map {
  private _occupied: TPositionSet = new Set();
  private _player: TPosition | null = null;
  private _obstecles: TPositionSet = new Set();
  private _points: TPositionSet = new Set();

  private generatePlayer() {
    this._player = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ];
    this._occupied.add(this._player);
  }

  private generateObstecles() {
    while (this._obstecles.size < 20) {
      const pos: [number, number] = [
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
      ];
      if (this._occupied.has(pos)) continue;
      this._occupied.add(pos);
      this._obstecles.add(pos);
    }
  }

  private generatePoints() {
    while (this._points.size < 10) {
      const pos: [number, number] = [
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
      ];
      if (this._occupied.has(pos)) continue;
      this._occupied.add(pos);
      this._points.add(pos);
    }
  }

  generate() {
    this.generatePlayer();
    this.generateObstecles();
    this.generatePoints();
    return this;
  }

  sendMap(): IMap | void {
    if (!this._player) throw new Error("No player created!");
    if (this._player)
      return {
        player: this._player,
        obstacles: Array.from(this._obstecles),
        points: Array.from(this._points),
      };
  }
}
