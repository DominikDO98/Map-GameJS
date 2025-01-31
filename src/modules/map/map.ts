export class Map {
  private _occupied: Set<[number, number]> = new Set<[number, number]>();
  private _player: [number, number] | null = null;
  private _obstecles: Set<[number, number]> = new Set<[number, number]>();
  private _points: Set<[number, number]> = new Set<[number, number]>();

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
  }
}
