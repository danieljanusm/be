export type DatabaseRecord<T> = T & RecordParameters;

interface RecordParameters {
  id: string;
  createdAt: Date;
  updateAt?: Date;
  deletedAt?: Date;
}
