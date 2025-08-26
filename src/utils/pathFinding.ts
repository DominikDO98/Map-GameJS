import { GRID_SIZE, movement } from "../constants/index.js";
import type { IMapDTO, TPosition } from "../types/map.js";

interface INode {
  position: TPosition;
  parent?: INode;
  g: number; // Cost from start to this node
  h: number; // Heuristic cost to goal
  f: number; // Total cost (g + h)
}

export class PathFinding {
  private _map: IMapDTO;

  constructor(map: IMapDTO) {
    this._map = map;
  }

  private arrayIncludes(arr: TPosition[], pos: TPosition): boolean {
    return arr.some((item) => item[0] === pos[0] && item[1] === pos[1]);
  }

  private checkPosition = (pos: TPosition): boolean => {
    return (
      pos[0] >= 0 &&
      pos[0] <= GRID_SIZE &&
      pos[1] >= 0 &&
      pos[1] <= GRID_SIZE &&
      !this.arrayIncludes([...this._map.obstacles, ...this._map.enemies], pos)
    );
  };

  private calculateNewPosition(pos: TPosition, move: TPosition): TPosition {
    return [pos[0] + move[0], pos[1] + move[1]] as TPosition;
  }

  private getSurroundings(curr: TPosition) {
    return [
      this.calculateNewPosition(curr, movement.up),
      this.calculateNewPosition(curr, movement.down),
      this.calculateNewPosition(curr, movement.left),
      this.calculateNewPosition(curr, movement.right),
    ].filter((pos) => this.checkPosition(pos));
  }

  private calacluteSurroundings(node: INode, goal: INode): INode[] {
    return this.getSurroundings(node.position).map((pos) => {
      const g = node.g + 1; // Cost from start to this node
      const h =
        Math.abs(pos[0] - goal.position[0]) +
        Math.abs(pos[1] - goal.position[1]); // Heuristic cost to goal
      const f = g + h; // Total cost
      return {
        position: pos,
        parent: node,
        g: g,
        h: h,
        f: f,
      } as INode;
    });
  }

  findPath(start: TPosition, goal: TPosition): TPosition[] {
    const path: Array<TPosition> = [];
    let iterations = 0;
    const startNode: INode = {
      position: start,
      g: 0,
      h: Math.abs(start[0] - goal[0]) + Math.abs(start[1] - goal[1]),
      f: 0, //Placeholder
    };
    startNode.f = startNode.g + startNode.h; //Calculate true f.cost for starting node
    const goalNode: INode = {
      position: goal,
      g: 0,
      h: 0,
      f: 0,
    };

    const toCalculateList: INode[] = [startNode]; // Nodes to be evaluated
    const proccessedList: Set<string> = new Set(); // Nodes already evaluated
    while (toCalculateList.length > 0 && iterations < 1000) {
      iterations++;
      //Sort the list by f value
      toCalculateList.sort((a, b) => a.f - b.f);
      // Get the node with the lowest f value
      const currentNode = toCalculateList.shift() as INode;
      const [x, y] = currentNode.position;
      // If the current node is the goal, reconstruct the path
      if (x === goal[0] && y === goal[1]) {
        let node: INode | null = currentNode;
        // console.log("node:   ", node);
        while (node) {
          path.unshift(node.position);
          node = node.parent || null;
          // If no path is found, return an empty array
        }
        return path;
      }
      // Mark the current node as processed
      proccessedList.add(`${x},${y}`);
      // Get the surroundings of the current node
      const surroundings = this.calacluteSurroundings(currentNode, goalNode);
      for (const neighbor of surroundings) {
        const [nx, ny] = neighbor.position;
        // If the neighbor is already processed, skip it
        if (proccessedList.has(`${nx},${ny}`)) continue;

        // If the neighbor is not in the toCalculateList, add it
        if (
          !this.arrayIncludes(
            toCalculateList.map((n) => n.position),
            neighbor.position
          )
        ) {
          toCalculateList.push(neighbor);
        } else {
          // If the neighbor is already in the list, check if the new path is better
          const existingNode = toCalculateList.find(
            (n) => n.position[0] === nx && n.position[1] === ny
          );
          if (existingNode && neighbor.g < existingNode.g) {
            existingNode.g = neighbor.g;
            existingNode.h = neighbor.h;
            existingNode.f = neighbor.f;
            existingNode.parent = currentNode;
          }
        }
      }
    }
    // If no path is found, return an empty array
    return path;
  }
}
