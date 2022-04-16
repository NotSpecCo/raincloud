import Dexie from 'dexie';
import type { QueryItem } from '../models';

export class Database extends Dexie {
  queries: Dexie.Table<QueryItem, string>;

  constructor(name: string) {
    super(name);

    this.version(1).stores({
      queries: '&key, &expiresAt, refresh, [expiresAt+refresh]',
    });

    this.queries = this.table('queries');
  }

  public async upsertQuery(query: QueryItem): Promise<void> {
    const existing = await this.queries.get({ key: query.key });

    if (existing) {
      await this.queries.put(query, query.key);
    } else {
      await this.queries.add(query, query.key);
    }
  }

  public async getQuery<T>(key: string): Promise<QueryItem<T> | null> {
    const result = await this.queries.get({ key });
    return result as QueryItem<T>;
  }

  public async deleteQuery(key: string): Promise<void> {
    await this.queries.delete(key);
  }

  public async deleteAllQueries(): Promise<void> {
    await this.queries.clear();
  }
}
