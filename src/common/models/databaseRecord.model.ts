export type DatabaseRecord<T> = T & RecordParameters;

interface RecordParameters {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
