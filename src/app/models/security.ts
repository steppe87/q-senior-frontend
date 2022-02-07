export interface Security {
  id: string,
  name: string,
  type: string,
  currency: string,
  isPrivate: boolean,
}

export interface PagingFilter {
  skip?: number,
  limit?: number,
}

export interface SecuritiesFilter extends PagingFilter {
  name?: string,
  types?: string[]
  currencies?: string[],
  isPrivate?: boolean,
}
