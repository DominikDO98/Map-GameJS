export type TPositionSet = Set<TPosition>;
export type TPosition = [number, number];

export interface IMap {
  player: TPosition;
  obstacles: TPositionSet;
  points: TPositionSet;
}
