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
    const query = await this.db.getQuery<T>(queryKey).catch((err) => {
      console.log(`Failed to get query cache: ${queryKey}`, err.message);
      return null;
    });

    return query;
  }

  set(queryKey: string, data: unknown, options: Partial<QueryOptions> = {}): Promise<void> {
    const opts: QueryOptions = {
      expiresIn: 1_800_000,
      backgroundRefresh: false,
      ...options,
    };

    return this.db
      .upsertQuery({
        key: queryKey,
        data,
        expiresAt: Date.now() + opts.expiresIn,
        refresh: opts.backgroundRefresh,
      })
      .catch((err) => console.log(`Failed to set query cache: ${queryKey}`, err.message));
  }

  async invalidate(prefix?: string): Promise<void> {
    if (prefix) {
      await this.db.deleteQueryBy(prefix);
    } else {
      await this.db.deleteAllQueries();
    }
  }
}
