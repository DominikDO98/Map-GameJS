import { MapController } from "controllers/map.controller.js";
import { RpcConnection } from "../lib/src/broker/connection.js";
class App {
  private _broker: RpcConnection;
  constructor() {
    this._broker = new RpcConnection();
  }
  async init() {
    await this._broker.init().then(() => {
      new MapController(this._broker).initQs();
    });
  }
}
new App().init();
