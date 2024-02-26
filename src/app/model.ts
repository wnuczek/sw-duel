export type SwapiResponse<T> = {
  message: string;
  result: SwapiResult<T>;
};

export type SwapiResult<T> = {
  properties: T;
  description: string;
  _id: string;
  uid: string;
  url: string;
};

export const isSwapiPerson = (
  resource: SwapiPerson | SwapiStarship
): resource is SwapiPerson => {
  return (resource as SwapiPerson).hair_color !== undefined;
};

export const isSwapiStarship = (
  resource: SwapiPerson | SwapiStarship
): resource is SwapiStarship => {
  return (resource as SwapiStarship).crew !== undefined;
};

export type SwapiPerson = {
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  created: Date;
  edited: Date;
  name: string;
  homeworld: string;
  url: string;
};

export interface SwapiStarship {
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: number;
  cargo_capacity: number;
  consumables: string;
  pilots: SwapiPerson[];
  created: Date;
  edited: Date;
  name: string;
  url: string;
}
