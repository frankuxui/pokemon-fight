export type Pokemon = {
  id: number;
  name: string;
  order: number | null;
  base_experience: number;
  height: number; // en metros
  weight: number; // en kg
  types: string[];
  abilities: string[];
  stats: {
    name: string;
    base_stat: number;
    effort: number;
  }[];
  sprite: string;
};