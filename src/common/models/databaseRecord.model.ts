export type DatabaseRecord<T> = T & RecordParameters;

export interface PaginatedRecord<T> {
  pageSize: number;
  page: number;
  totalPages: number;
  totalCount: number;
  data: T;
}

interface RecordParameters {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
