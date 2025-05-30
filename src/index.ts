import { RpcConnection } from "../lib/src/broker/connection.js";
import { logger } from "../lib/src/logger/logger.js";
import { Map } from "./modules/map/map.js";

class App {
  private _broker: RpcConnection;
  constructor() {
    this._broker = new RpcConnection();
  }
  async init() {
    await this._broker.init();
    if (this._broker.connection) {
      this._broker.listenQ("map", (replyQ, msg) => {
        logger.warn(
          `need to use replyq and msg, ${msg}, ${replyQ}`,
          "ListenQ",
          false
        );
        this._broker.replyCall(replyQ, JSON.stringify(this.sendMap()));
      });
    }
  }

  sendMap() {
    return new Map().generate().sendMap();
  }
}

new App().init();
