interface IObstecle {
  location: [number, number];
  penetrable: false;
}

interface IPlayer {
  location: [number, number];
  penetrable: false;
}

interface IPoint {
  location: [number, number];
  penetrable: true;
}

interface ITile {
  location: [number, number];
  object: IObstecle | IPoint | IPlayer | null;
}
