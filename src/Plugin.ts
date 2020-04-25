import { Socket, Player } from "./index";
import { Manager } from "./Manager";
import { SocketOptions } from "./Socket";

export class Plugin {
  public manager: Manager;

  public onLoad(): any {
    throw new Error(`${this.constructor.name}#onLoad hasn't been implemented.`);
  }

  public onNewSocket(_socket: Socket, _options: SocketOptions): any {
    throw new Error(
      `${this.constructor.name}#onNewSocket hasn't been implemented.`
    );
  }

  public onPlayerSummon(_player: Player): any {
    throw new Error(
      `${this.constructor.name}#onPlayerSummon hasn't been implemented.`
    );
  }

  public init(manager: Manager) {
    this.manager = manager;
  }
}
