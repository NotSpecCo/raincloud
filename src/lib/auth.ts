import KaiOS from 'kaios-lib';
import { push } from 'svelte-spa-router';
import type { AuthSession, Tokens, User } from '../models';

const AUTH_STORAGE_KEY = 'auth_session';

type Options = {
  apiBaseUrl: string;
  clientId: string;
};
export class Auth {
  private options: Options;

  constructor(options: Partial<Options> = {}) {
    this.options = {
      apiBaseUrl: 'https://api.raincloud.fm',
      clientId:
        process.env.NODE_ENV === 'production'
          ? 'ttmRWSTGJ7pzm1s8znU3CSJ5mXSjtS0l'
          : 'Gbv3N4cjTjVMwfaHVbCdEB7W5Y3JQM28',
      ...options,
    };
  }

  setSession(session: AuthSession): void {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  async getSession(): Promise<AuthSession> {
    let session: AuthSession = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) as string);

    if (!session) {
      push('/signin');
      throw new Error('No session found! You must sign in first.');
    }

    if (session.expires_at < Date.now() + 600000) {
      console.log(
        `Session expiring (${new Date(session.expires_at).toISOString()}), refreshing...`
      );
      await this.refreshSession(session);
      session = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) as string);
    }

    return session;
  }

  async updateSessionUser(user: User): Promise<void> {
    const session = await this.getSession();
    this.setSession({
      ...session,
      user_id: user.id,
      user_name: user.full_name || user.username,
      user_avatar_url: user.avatar_url,
    });
  }

  clearSession(): void {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async fetchTokensFromQRCode(): Promise<void> {
    const qrCode = new KaiOS.QRCode();
    const text = await qrCode.readAsText();
    const user: User = await this.fetchAuthUser(JSON.parse(text).access_token);

    this.setSession({
      ...JSON.parse(text),
      user_id: user.id,
      user_name: user.full_name || user.username,
      user_avatar_url: user.avatar_url,
    });
  }

  async fetchTokensFromCode(code: string): Promise<void> {
    const tokens: Tokens = await new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => reject(new Error('Failed to fetch tokens')));
      xhr.open('POST', `${this.options.apiBaseUrl}/getTokens`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(
        JSON.stringify({
          clientId: this.options.clientId,
          code,
        })
      );
    });
    const user: User = await this.fetchAuthUser(tokens.access_token);

    this.setSession({
      ...tokens,
      user_id: user.id,
      user_name: user.full_name || user.username,
      user_avatar_url: user.avatar_url,
    });
  }

  private async fetchAuthUser(accessToken: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('GET', `https://api.soundcloud.com/me`);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });
  }

  private refreshSessionRequest: Promise<void> | null = null;

  private refreshSession(session: AuthSession): Promise<void> {
    if (this.refreshSessionRequest) {
      return this.refreshSessionRequest;
    }

    this.refreshSessionRequest = new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => reject(new Error('Failed to refresh tokens')));
      xhr.open('POST', `${this.options.apiBaseUrl}/refreshTokens`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(
        JSON.stringify({
          clientId: this.options.clientId,
          refreshToken: session.refresh_token,
        })
      );
    })
      .then((tokens: Tokens) =>
        this.setSession({
          ...session,
          ...tokens,
        })
      )
      .finally(() => (this.refreshSessionRequest = null));
  }
}
