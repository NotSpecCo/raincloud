import KaiOS from 'kaios-lib';
import { calculatePKCECodeChallenge, randomPKCECodeVerifier, randomState } from 'openid-client';
import { push } from 'svelte-spa-router';
import type { AuthSession, Tokens, User } from '../models';

const AUTH_STORAGE_KEY = 'auth_session';
const CODE_VERIFIER_KEY = 'code_verifier';

type Options = {
  apiBaseUrl: string;
  clientId: string;
  redirectUri: string;
};
export class Auth {
  private options: Options;

  constructor(options: Partial<Options> = {}) {
    const baseOptions: Options =
      process.env.NODE_ENV === 'production'
        ? {
            apiBaseUrl: 'https://raincloud.fm',
            clientId: 'ttmRWSTGJ7pzm1s8znU3CSJ5mXSjtS0l',
            redirectUri: 'https://raincloud.fm/oauth',
          }
        : {
            apiBaseUrl: 'http://localhost:3001',
            clientId: 'Gbv3N4cjTjVMwfaHVbCdEB7W5Y3JQM28',
            redirectUri: 'http://localhost:3000',
          };

    this.options = {
      ...baseOptions,
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

    if (session.expiresAt < Date.now() + 600000) {
      console.log(`Session expiring (${new Date(session.expiresAt).toISOString()}), refreshing...`);
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

  async initiateWebLogin(): Promise<void> {
    const url = new URL('https://secure.soundcloud.com/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.options.clientId);
    url.searchParams.append('redirect_uri', this.options.redirectUri);

    const codeVerifier = randomPKCECodeVerifier();
    sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    const codeChalenge = await calculatePKCECodeChallenge(codeVerifier);
    url.searchParams.append('code_challenge', codeChalenge);
    url.searchParams.append('code_challenge_method', 'S256');

    const state = randomState();
    url.searchParams.append('state', state);

    console.log('url', url.toString());

    window.location.href = url.toString();
  }

  async fetchTokensFromQRCode(): Promise<void> {
    const qrCode = new KaiOS.QRCode();
    const text = await qrCode.readAsText();
    const payload = JSON.parse(text) as Tokens;

    const user: User = await this.fetchAuthUser(payload.accessToken);

    this.setSession({
      ...payload,
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
      xhr.open('POST', `${this.options.apiBaseUrl}/api/v1/token`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(
        JSON.stringify({
          clientId: this.options.clientId,
          code,
          codeVerifier: sessionStorage.getItem(CODE_VERIFIER_KEY),
          redirectUri: this.options.redirectUri,
        })
      );
    });
    const user: User = await this.fetchAuthUser(tokens.accessToken);

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
      xhr.open('POST', `${this.options.apiBaseUrl}/api/v1/token/refresh`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(
        JSON.stringify({
          clientId: this.options.clientId,
          refreshToken: session.refreshToken,
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
