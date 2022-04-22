import type { Tokens } from './Tokens';

export type AuthSession = Tokens & {
  user_id: number;
  user_name: string;
  user_avatar_url: string;
};
