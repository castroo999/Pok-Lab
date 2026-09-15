export type ApiResource = {
  name: string;
  url: string;
};

export type EncounterDetail = {
  min_level: number;
  max_level: number;
  chance: number;
  method: ApiResource;
  condition_values: ApiResource[];
};

export type VersionEncounterDetail = {
  version: ApiResource;
  max_chance: number;
  encounter_details: EncounterDetail[];
};

export type PokemonEncounter = {
  location_area: ApiResource;
  version_details: VersionEncounterDetail[];
};