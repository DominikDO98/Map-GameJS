import { MapController } from "./controllers/map.controller.js";
import { RpcConnectionManager } from "../lib/broker/connectionManager.js";
import { logger } from "../lib/logger/logger.js";
class App {
  private _broker: RpcConnectionManager;
  constructor() {
    this._broker = new RpcConnectionManager();
  }
  async init() {
    try {
      await this._broker.init();
      new MapController(this._broker).initQs();
    } catch (err) {
      logger.error(err as string, "App.init", true);
    }
    this._broker.reconnect();
  }
}
new App().init();
