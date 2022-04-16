export type QueryItem<T = unknown> = {
  key: string;
  data: T;
  expiresAt: number;
  refresh: boolean;
};
