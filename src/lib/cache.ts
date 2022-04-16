import type { QueryItem } from '../models';
import { Database } from './database';

type QueryOptions = {
  expiresIn: number;
  backgroundRefresh: boolean;
};

export class Cache {
  db: Database;

  constructor() {
    this.db = new Database('raincloud');
  }

  async get<T>(queryKey: string): Promise<QueryItem<T> | null> {
    const query = await this.db.getQuery<T>(queryKey);
    if (!query) {
      return null;
    } else if (query.expiresAt <= Date.now()) {
      await this.db.deleteQuery(query.key);
      return null;
    } else {
      return query;
    }
  }

  set(queryKey: string, data: unknown, options: Partial<QueryOptions> = {}): Promise<void> {
    const opts: QueryOptions = {
      expiresIn: 3_600_000,
      backgroundRefresh: false,
      ...options,
    };

    return this.db.upsertQuery({
      key: queryKey,
      data,
      expiresAt: Date.now() + opts.expiresIn,
      refresh: opts.backgroundRefresh,
    });
  }

  invalidate(): Promise<void> {
    return this.db.deleteAllQueries();
  }
}
