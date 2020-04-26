import * as Lava from "@kyflx-dev/lavalink-types";
import { EventEmitter } from "events";

import { Manager } from "./Manager";
import LavaSocket from "./Socket";
import { VoiceServer, VoiceState } from ".";

export type PlayOptions = Partial<
  Omit<Lava.PlayTrack, "op" | "guildId" | "track">
>;

export interface ConnectOptions {
  deaf?: boolean;
  mute?: boolean;
}

export default class GuildPlayer extends EventEmitter {
  public node: LavaSocket;
  public manager: Manager;

  public guildId: string;
  public channelId: string;
  public paused: boolean;
  public state: Lava.PlayerState;
  public track: string;
  public playing: boolean;
  public timestamp: number;
  public volume: number;

  protected _server: VoiceServer;
  protected _state: VoiceState;

  public constructor(guildId: string, node: LavaSocket, manager: Manager) {
    super();

    this.guildId = guildId;
    this.node = node;
    this.manager = manager;

    this.on("event", async (event: Lava.Event) => {
      const emit = (event: string, ...args: any[]): boolean =>
        this.listenerCount(event) ? this.emit(event, ...args) : null;

      switch (event.type) {
        case "TrackEndEvent":
          emit("end", event);

          if (event.reason !== "REPLACED") {
            this.playing = false;
          }

          this.track = null;
          this.timestamp = null;
          break;
        case "TrackExceptionEvent":
          emit("error", event.exception ?? event.error);
          break;
        case "TrackStartEvent":
          emit("start", event.track);
          break;
        case "TrackStuckEvent":
          await this.stop();
          emit("end", event);
          break;
        case "WebSocketClosedEvent":
          emit("closed", event);
          break;
      }
    }).on("playerUpdate", (data: Lava.PlayerUpdate) => {
      this.state = data.state;
    });
  }

  public async connect(
    channelId: string,
    options: ConnectOptions = {}
  ): Promise<GuildPlayer> {
    this.channelId = channelId;

    await this.manager.send(this.guildId, {
      op: 4,
      d: {
        guild_id: this.guildId,
        channel_id: channelId,
        self_deaf: options.deaf ?? false,
        self_mute: options.mute ?? false,
      },
    });

    return this;
  }

  public async leave(): Promise<GuildPlayer> {
    this.channelId = null;

    await this.manager.send(this.guildId, {
      op: 4,
      d: {
        guild_id: this.guildId,
        channel_id: null,
        self_deaf: null,
        self_mute: null,
      },
    });

    return this;
  }

  // Actions
  public play(track: string, options: PlayOptions = {}): Promise<boolean> {
    this.track = track;
    this.timestamp = Date.now();
    this.playing = true;
    return this.send("play", { track, ...options });
  }

  public stop(): Promise<boolean> {
    this.playing = false;
    this.timestamp = null;
    this.track = null;
    return this.send("stop");
  }

  public pause(pause = true): Promise<boolean> {
    this.paused = pause;
    return this.send("pause", { pause });
  }

  public resume(): Promise<boolean> {
    return this.pause(false);
  }

  public seek(position: number): Promise<boolean> {
    return this.send("seek", { position });
  }

  public setVolume(volume: number): Promise<boolean> {
    this.volume = volume;
    return this.send("volume", { volume });
  }

  public equalizer(bands: Lava.EqualizerBand[]): Promise<boolean> {
    return this.send("equalizer", { bands });
  }

  public async destroy(): Promise<boolean> {
    this.removeAllListeners();
    this.manager.removePlayer(this.guildId);
    return this.send("destroy");
  }

  _provideServer(server: VoiceServer): void {
    this._server = server;
  }

  _provideState(state: VoiceState): void {
    this._state = state;
  }

  async _update(): Promise<boolean> {
    return this.send("voiceUpdate", {
      sessionId: this._state.session_id,
      event: this._server,
    });
  }

  protected send(op: string, body: Record<string, any> = {}): Promise<boolean> {
    const guildId = this.guildId;
    return this.node.send({ op, ...body, guildId });
  }
}
