import express, { Request, Response } from "express";
import { Map } from "./modules/map/map.js";
const app = express();

app.get("/map", (_req: Request, res: Response) => {
  const map = new Map();
  map.generate();
  console.log(map.sendMap());

  res.send(map.sendMap());
});

app.listen(3000, "localhost", () => {
  console.log("Server is running on port 3000");
});
