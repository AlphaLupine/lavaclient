import {
  VolumeFilter,
  TimescaleFilter,
  KaraokeFilter,
  TremoloFilter,
  RotationFilter,
  DistortionFilter,
  EqualizerFilter,
  VibratoFilter,
  Filter,
  FilterData
} from "@lavaclient/types";

import type { Player } from "./Player";

export class Filters {
  /**
   * The default volume configuration
   */
  static DEFAULT_VOLUME: VolumeFilter = 1;

  /**
   * The default configuration for timescale..
   */
  static DEFAULT_TIMESCALE: TimescaleFilter = {
    rate: 1,
    speed: 1,
    pitch: 1
  }

  /**
   * The default karaoke configuration.
   */
  static DEFAULT_KARAOKE: KaraokeFilter = {
    level: 1,
    monoLevel: 1,
    filterBand: 220,
    filterWidth: 100
  }

  /**
   * The default tremolo configuration.
   */
  static DEFAULT_TREMOLO: TremoloFilter = {
    depth: .5,
    frequency: 2
  }

  /**
   * The player this filters instance is for..
   */
  readonly player: Player;

  /**
   * The timescale filter.
   */
  timescale?: TimescaleFilter;

  /**
   * The karaoke filter.
   */
  karaoke?: KaraokeFilter;

  /**
   * The equalizer filter.
   */
  equalizer: EqualizerFilter;

  /**
   * The distortion filter.
   */
  distortion?: DistortionFilter;

  /**
   * The volume filter.
   */
  volume: VolumeFilter;

  /**
   * The tremolo filter.
   */
  tremolo?: TremoloFilter;

  /**
   * The rotation filter.
   */
  rotation?: RotationFilter;

  /**
   * The vibrato filter.
   */
  vibrato?: VibratoFilter;

  /**
   * @param player The player instance.
   */
  constructor(player: Player) {
    this.player = player;

    this.volume = 1;
    this.equalizer = [];
  }

  /**
   * Whether the rotation filter is enabled.
   */
  get isRotationEnabled(): boolean {
    return !!this.rotation; // TODO: check if it's actually enabled, or not.
  }

  get isDistortionEnabled(): boolean {
    return !!this.distortion; // TODO: check if it's actually enabled, or not.
  }

  /**
   * Whether the equalizer filter is enabled.
   * Checks if any of the provided bans doesn't have a gain of 0.0, 0.0 being the default gain.
   */
  get isEqualizerEnabled(): boolean {
    return this.equalizer?.some(band => band.gain !== 0.0);
  }

  /**
   * Whether the tremolo filter is enabled or not.
   * Checks if it's null or the depth does not equal 0.0.
   */
  get isTremoloEnabled(): boolean {
    return !!this.tremolo && this.tremolo.depth !== 0.0;
  }

  /**
   * Whether the karaoke filter is enabled or not.
   * Checks if the karaoke property does not equal null.
   */
  get isKaraokeEnabled(): boolean {
    return !!this.karaoke;
  }

  /**
   * Whether the timescale filter is enabled.
   * Checks if the property does not equal and if any of it's properties doesn't equal 1.0
   */
  get isTimescaleEnabled(): boolean {
    return !!this.timescale && Object.values(this.timescale).some(v => v !== 1.0);
  }

  /**
   * The filters payload.
   */
  get payload(): Partial<FilterData> {
    const payload: Partial<FilterData> = {
      [Filter.Volume]: this.volume,
      [Filter.Equalizer]: this.equalizer
    }

    if (this.isTimescaleEnabled) {
      payload[Filter.Timescale] = this.timescale;
    }

    if (this.isKaraokeEnabled) {
      payload[Filter.Karaoke] = this.karaoke;
    }

    if (this.isTremoloEnabled) {
      payload[Filter.Tremolo] = this.tremolo;
    }

    if (this.isDistortionEnabled) {
      payload[Filter.Distortion] = this.distortion;
    }

    if (this.isRotationEnabled) {
      payload[Filter.Rotation] = this.rotation;
    }

    return payload;
  }

  /**
   * Applies the filters to the player.
   * @param prioritize Whether to prioritize the payload.
   */
  apply(prioritize = false): this {
    this.player.send("filters", this.payload, prioritize);
    return this;
  }
}
