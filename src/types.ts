export interface Repo {
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
}

export interface PaginatedRepoResponse {
  data: Repo[];
  totalPages: number;
}
