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

  initQs() {
    this.listen(EQueues.Map, this.generateMap);
  }

  listen(
    queue: string,
    callback: (replyQueue: string, msg: ConsumeMessage | null) => void
  ) {
    this._broker
      .listenQ(queue, callback.bind(this))
      .then(() => {
        logger.log(
          `MapController is listening to ${callback.name} requests`,
          "MapConstoller.listen",
          false
        );
      })
      .catch((err) => {
        logger.error(err as string, "MapController.listen", true);
        setTimeout(() => {
          this.initQs();
        }, 500);
      });
  }

  private generateMap(replyQ: string, msg: ConsumeMessage | null): void {
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
