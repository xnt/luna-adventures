export type Rng = () => number;

export const createRng = (seed = 1): Rng => {
  let state = Math.max(1, seed | 0);
  return () => {
    state = (state * 48271) % 0x7fffffff;
    return state / 0x7fffffff;
  };
};
