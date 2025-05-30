import { ConsumeMessage } from "amqplib";
import { EQueues } from "enums/index.js";
import { IDifficultySettings } from "types/map.js";
import { RpcConnection } from "../../lib/src/broker/connection";
import { logger } from "../../lib/src/logger/logger";
import { DEFAULT_DIFFICULTY } from "../constants/index.js";
import { Map } from "../models/map.js";

export class MapController {
  private _broker: RpcConnection;

  constructor(broker: RpcConnection) {
    this._broker = broker;
  }

  listen() {
    this._broker
      .listenQ(EQueues.Map, this.generateMap.bind(this))
      .then(() => {
        logger.log(
          "MapController listening for map generation requests",
          "MapController.listen",
          false
        );
      })
      .catch((err) => {
        logger.error(err as string, "MapController.listen", true);
        setTimeout(() => {
          this.listen();
        }, 500);
      });
  }

  generateMap(replyQ: string, msg: ConsumeMessage | null): void {
    try {
      const diff: IDifficultySettings = msg
        ? JSON.parse(msg?.content.toString())
        : DEFAULT_DIFFICULTY;
      const dto = new Map(diff).generate().toDTO();
      this._broker.replyCall(replyQ, JSON.stringify(dto));
      return;
    } catch (err) {
      logger.error(err as string, "MapController.generateMap", true);
      return;
    }
  }
}
