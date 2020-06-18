// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../events
//   ../@kyflx-dev/lavalink-types
//   ../ws

import { EventEmitter } from "events";
import { EqualizerBand, NodeStats, Track } from "@kyflx-dev/lavalink-types";
import WebSocket from "ws";

declare module "lavaclient" {
  export class Manager extends EventEmitter {
    /**
     * A map of connected sockets.
     */
    readonly sockets: Map<string, Socket>;
    /**
     * A map of connected players.
     */
    readonly players: Map<string, Player>;
    /**
     * The plugins this manager was created with.
     */
    options: ManagerOptions;
    /**
     * The client's user id.
     */
    userId: string;
    /**
     * A send method for sending voice state updates to discord.
     */
    send: Send;
    /**
     * The number of shards the client is running on.
     */
    shards: number;

    /**
     * @param nodes An array of sockets to connect to.
     * @param options
     */
    constructor(nodes: SocketData[], options: ManagerOptions);

    get ideal(): Socket[];

    /**
     * Register a plugin for use.
     * @param plugin
     * @since 2.x.x
     */
    use(plugin: Plugin): Manager;

    /**
     * Initializes this manager. Connects all provided sockets.
     * @param userId The client user id.
     * @since 1.0.0
     */
    init(userId?: string): void;

    /**
     * Used for providing voice server updates to lavalink.
     * @param update The voice server update sent by Discord.
     * @since 1.0.0
     */
    serverUpdate(update: VoiceServer): Promise<void>;

    /**
     * Used for providing voice state updates to lavalink
     * @param update The voice state update sent by Discord.
     * @since 1.0.0
     */
    stateUpdate(update: VoiceState): Promise<void>;

    /**
     * Create a player.
     * @param data The data to give the created player.
     * @param options Options used when connecting to a voice channel.
     * @since 2.1.0
     */
    create(data: PlayerData & {
      socket?: string;
    }, options?: ConnectOptions & {
      noConnect?: boolean;
    }): Promise<Player>;

    /**
     * Destroys a player and leaves the connected voice channel.
     * @param guild The guild id of the player to destroy.
     * @since 2.1.0
     */
    destroy(guild: string): Promise<boolean>;

    on(event: "socketError", listener: (socket: Socket, error: any) => void): Manager;
    on(event: "socketReady", listener: (socket: Socket) => void): Manager;
    on(event: "socketClose", listener: (socket: Socket, code: number, reason: string) => void): Manager;
    on(event: "socketDisconnect", listener: (socket: Socket, tries: number) => void): Manager;
  }

  export class Player extends EventEmitter {
    /**
     * The socket this player belongs to.
     */
    readonly socket: Socket;
    /**
     * The id of the guild this player belongs to.
     */
    readonly guild: string;
    /**
     * The voice channel id in which this player is connected to.
     */
    channel: string | null;
    /**
     * Whether this player is paused or not.
     */
    paused: boolean;
    /**
     * The current playing track.
     */
    track: string | null;
    /**
     * Whether this player is playing or not.
     */
    playing: boolean;
    /**
     * The unix timestamp in which this player started playing.
     */
    timestamp: number | null;
    /**
     * Track position in milliseconds.
     */
    position: number;
    /**
     * The current volume of this player.
     */
    volume: number;
    /**
     * Equalizer bands this player is using.
     */
    equalizer: EqualizerBand[];

    /**
     * @param socket The socket this player belongs to.
     * @param data Player Data.
     */
    constructor(socket: Socket, data: PlayerData);

    /**
     * The head manager of everything.
     * @since 2.1.0
     */
    get manager(): Manager;

    /**
     * Connects to the specified voice channel.
     * @param channel A channel id or object.
     * @param options Options for self mute, self deaf, or force connecting.
     * @since 2.1.x
     */
    connect(channel: string | Record<string, any>, options?: ConnectOptions & {
      force?: boolean;
    }): Promise<Player>;

    /**
     * Disconnect from the voice channel.
     * @since 2.1.x
     */
    disconnect(): Promise<this>;

    /**
     * Plays the specified base64 track.
     * @param track The track to play.
     * @param options Play options to send along with the track.
     * @since 1.x.x
     */
    play(track: string | Track, options?: PlayOptions): Promise<void>;

    /**
     * Change the volume of the player. You can omit the volume param to reset back to 100
     * @param volume May range from 0 to 1000, defaults to 100
     */
    setVolume(volume?: number): Promise<void>;

    /**
     * Change the paused state of this player. `true` to pause, `false` to resume.
     * @param state Pause state, defaults to true.
     * @since 1.x.x
     */
    pause(state?: boolean): Promise<void>;

    /**
     * Resumes the player, if paused.
     * @since 1.x.x
     */
    resume(): Promise<void>;

    /**
     * Stops the current playing track.
     * @since 1.x.x
     */
    stop(): Promise<void>;

    /**
     * Seek to a position in the current song.
     * @param position The position to seek to in milliseconds.
     */
    seek(position: number): Promise<void>;

    /**
     * Sets the equalizer of this player.
     * @param bands Equalizer bands to use.
     * @since 2.1.x
     */
    setEqualizer(bands: EqualizerBand[]): Promise<void>;

    /**
     * Destroy this player.
     * @param disconnect Disconnect from the voice channel.
     * @since 1.x.x
     */
    destroy(disconnect?: boolean): Promise<void>;

    /**
     * Provide a voice update from discord.
     * @param update
     * @since 1.x.x
     * @private
     */
    provide(update: VoiceState | VoiceServer): this;

    /**
     * Send a voice update to lavalink.
     * @since 2.1.x
     * @private
     */
    voiceUpdate(): Promise<void>;

    On

    /**
     * Adds
     * @private
     */
    protected _setup(): void;
  }

  export class Socket {
    /**
     * The manager this socket belongs to.
     */
    readonly manager: Manager;
    /**
     * This sockets identifier.
     */
    readonly id: string;
    /**
     * The host of the lavalink node we're connecting to.
     */
    readonly host: string;
    /**
     * The port of the lavalink node we're connecting to.
     */
    readonly port: string;
    /**
     * The authorization being used when connecting.
     */
    readonly password: string;
    /**
     * Total tries the node has used to reconnect.
     */
    tries: number;
    /**213
     * The resume key being used for resuming.
     */
    resumeKey: string;
    /**
     * The stats sent by lavalink.
     */
    stats: NodeStats;
    /**
     * The options this socket is using.
     */
    options: SocketOptions;
    /**
     * The websocket instance for this socket.
     */
    protected ws: WebSocket;
    /**
     * The queue for sendables.
     */
    protected queue: Sendable[];

    /**
     * @param manager The manager this socket belongs to.
     * @param data Data to use.
     */
    constructor(manager: Manager, data: SocketData);

    /**
     * Whether this socket is connected or not.
     */
    get connected(): boolean;

    toString(): string;

    /**
     * Send data to the websocket.
     * @param data Data to send. - JSON
     * @since 1.0.0
     */
    send(data: any): Promise<void>;

    /**
     * Configure Lavalink Resuming.
     * @param key The resume key.
     * @since 1.0.0
     */
    configureResuming(key?: string): Promise<void>;

    /**
     * Connects to the WebSocket.
     * @param userId The user id to use.
     * @since 1.0.0
     */
    connect(userId?: string): Socket;

    /**
     * Flushes out the send queue.
     * @since 1.0.0
     */
    protected flush(): Promise<void>;
  }

  /**
   * A plugin class used for making Lavaclient Plugins.
   */
  export abstract class Plugin {
    /**
     * The manager that loaded this plugin.
     */
    manager: Manager;

    /**
     * Called when this plugin is loaded.
     * @param manager The manager that loaded this plugin.
     */
    load(manager: Manager): void;

    /**
     * Called when the manager is initialized.
     * @since 2.0.0
     */
    init(): void;
  }

  export class Structures {
    /**
     * Extend the specified structure.
     * @param name The structure to extend.
     * @param extend The extender function.
     * @since 2.0.0
     */
    static extend<K extends keyof Classes, E extends Classes[K]>(name: K, extend: (base: Classes[K]) => E): E;

    /**
     * Get the specified structure.
     * @param name The structure to get.
     * @since 2.0.0
     */
    static get<K extends keyof Classes>(name: K): Classes[K];
  }

  /**
   * A typescript helper decorator for extending structures.
   * @param name The name of the structure to extend.
   * @constructor
   */
  export function Extend<K extends keyof Classes>(name: K): <T extends Classes[K]>(target: T) => T;

  // Interfaces and Types.

  export type Send = (guildId: string, payload: any) => any;

  export interface Classes {
    socket: typeof Socket;
    player: typeof Player;
  }

  export interface SocketData {
    id: string;
    host: string;
    port: string | number;
    password: string;
    options?: SocketOptions;
  }

  export interface SocketOptions {
    retryDelay?: number;
    maxTries?: number;
    resumeKey?: string;
    resumeTimeout?: number;
  }

  export interface Sendable {
    res: (...args: any[]) => any;
    rej: (...args: any[]) => any;
    data: string;
  }

  export interface PlayerData {
    channel?: string;
    guild: string;
  }

  export interface PlayOptions {
    startTime?: number;
    endTime?: number;
    noReplace?: boolean;
  }

  export interface ConnectOptions {
    selfDeaf?: boolean;
    selfMute?: boolean;
  }

  export interface ManagerOptions {
    send: Send;
    shards?: number;
    userId?: string;
    defaultSocketOptions?: SocketOptions;
  }

  export interface VoiceServer {
    token: string;
    guild_id: string;
    endpoint: string;
  }

  export interface VoiceState {
    channel_id?: string;
    guild_id: string;
    user_id: string;
    session_id: string;
    deaf?: boolean;
    mute?: boolean;
    self_deaf?: boolean;
    self_mute?: boolean;
    suppress?: boolean;
  }
}