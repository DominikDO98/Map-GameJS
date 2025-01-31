export type TPositionSet = Set<TPosition>;
export type TPosition = [number, number];

export interface IMap {
  player: TPosition;
  obstacles: TPosition[];
  points: TPosition[];
}
