import type { ConsumeMessage } from "amqplib";
import { EQueues } from "../enums/index.js";
import type { IDifficultySettings } from "../types/map.js";
import { logger } from "../../lib/logger/logger.js";
import { DEFAULT_DIFFICULTY } from "../constants/index.js";
import { Map } from "../models/map.js";
import { RpcConnectionManager } from "../../lib/broker/connectionManager.js";

export class MapController {
  private _broker: RpcConnectionManager;
  constructor(broker: RpcConnectionManager) {
    this._broker = broker;
  }
  initQs() {
    if (this._broker.isAlive) this.route(EQueues.Map, this.generateMap);
    if (!this._broker.isAlive)
      setTimeout(() => {
        this.initQs();
      }, 1000);
  }
  private route(
    queue: string,
    callback: (
      replyQueue: string,
      msg: ConsumeMessage | null
    ) => Promise<void> | void
  ) {
    this._broker.listenQ(queue, callback.bind(this), "Map Controller");
  }
  private generateMap(replyQ: string, msg: ConsumeMessage | null): void {
    try {
      const diff: IDifficultySettings = msg
        ? JSON.parse(msg?.content.toString())
        : DEFAULT_DIFFICULTY;
      const id = msg?.properties.correlationId;
      const dto = new Map(diff).generate().toDTO();
      this._broker.replyCall(replyQ, JSON.stringify(dto), id);
      return;
    } catch (err) {
      logger.error(err as string, "Map Controller", true);
      return;
    }
  }
}
