export type TileKind = "ground" | "stairs" | "pit";

export type FoeKind = "cat" | "roomba";

export type ItemKind = "food" | "drumstick";

export interface PlatformSegment {
  x: number;
  width: number;
  height: number;
  kind: TileKind;
}

export interface FoeSpawn {
  x: number;
  y: number;
  kind: FoeKind;
  platformStartX: number;
  platformEndX: number;
}

export interface ItemSpawn {
  x: number;
  y: number;
  kind: ItemKind;
}

export interface ChunkLayout {
  startX: number;
  endX: number;
  platforms: PlatformSegment[];
  foes: FoeSpawn[];
  items: ItemSpawn[];
}
