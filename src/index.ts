import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  console.log(req);
  res.sendStatus(200);
});

app.listen(3000, "localhost", () => {
  console.log("Server is running on port 3000");
});
