import { GAME_CONFIG } from "./constants";

export interface HealthState {
  hp: number;
  /** Brief post-hit i-frames OR drumstick buff end time (whichever is later) */
  immuneUntil: number;
  /** Drumstick / star power end time — contact defeats foes while active */
  starPowerUntil: number;
}

/** Remaining ms of star/drumstick power; 0 when inactive. */
export const starPowerRemainingMs = (state: HealthState, now: number): number =>
  Math.max(0, state.starPowerUntil - now);

export const isStarPowerActive = (state: HealthState, now: number): boolean =>
  starPowerRemainingMs(state, now) > 0;

/** Any immunity (star power or brief post-hit i-frames). */
export const isImmune = (state: HealthState, now: number): boolean =>
  now < state.immuneUntil;

/** True when star power is active but in its final warning window (blink phase). */
export const isStarPowerExpiring = (
  state: HealthState,
  now: number,
  warningMs = 1500
): boolean => {
  const remaining = starPowerRemainingMs(state, now);
  return remaining > 0 && remaining <= warningMs;
};

export const createHealth = (): HealthState => ({
  hp: GAME_CONFIG.maxHp,
  immuneUntil: 0,
  starPowerUntil: 0,
});

export const damage = (state: HealthState, amount: number, now: number): HealthState => {
  if (isImmune(state, now)) {
    return state;
  }
  return {
    ...state,
    hp: Math.max(0, state.hp - amount),
    immuneUntil: now + 600,
  };
};

export const heal = (state: HealthState, amount: number): HealthState => ({
  ...state,
  hp: Math.min(GAME_CONFIG.maxHp, state.hp + amount),
});

export const applyImmunity = (state: HealthState, now: number): HealthState => {
  const until = now + GAME_CONFIG.buffDurationMs;
  return {
    ...state,
    hp: GAME_CONFIG.maxHp,
    immuneUntil: until,
    starPowerUntil: until,
  };
};

export const isGameOver = (state: HealthState): boolean => state.hp <= 0;
