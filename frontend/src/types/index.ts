export type JobFilters = {
  search: string;
  location: string;
  fullTime: boolean;
};

export type SearchParams = Record<string, string | string[] | undefined>;

export type JobSummary = {
  id: number;
  company: string;
  logo: string;
  logoBackground: string;
  position: string;
  postedAt: string;
  contract: string;
  location: string;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};
