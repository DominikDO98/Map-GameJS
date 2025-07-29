import { ConsumeMessage } from "amqplib";
import { EQueues } from "enums/index.js";
import { IDifficultySettings } from "types/map.js";
import { logger } from "../../lib/src/logger/logger";
import { DEFAULT_DIFFICULTY } from "../constants/index.js";
import { Map } from "../models/map.js";
import { RpcConnectionManager } from "../../lib/src/broker/connectionManager";

export class MapController {
  private _broker: RpcConnectionManager;
  constructor(broker: RpcConnectionManager) {
    this._broker = broker;
  }
  initQs() {
    this.route(EQueues.Map, this.generateMap);
  }
  private route(
    queue: string,
    callback: (replyQueue: string, msg: ConsumeMessage | null) => void
  ) {
    this._broker.listenQ(queue, callback.bind(this), "Map Controller");
  }
  private async generateMap(
    replyQ: string,
    msg: ConsumeMessage | null
  ): Promise<void> {
    try {
      const diff: IDifficultySettings = msg
        ? JSON.parse(msg?.content.toString())
        : DEFAULT_DIFFICULTY;
      const dto = new Map(diff).generate().toDTO();
      this._broker.replyCall(replyQ, JSON.stringify(dto));
      return;
    } catch (err) {
      logger.error(err as string, "Map Controller", true);
      return;
    }
  }
}
