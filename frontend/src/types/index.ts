export type JobFilters = {
  search: string;
  location: string;
  fullTime: boolean;
};

export type SearchParams = Record<string, string | string[] | undefined>;
