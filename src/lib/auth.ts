import KaiOS from 'kaios-lib';
import type { Tokens } from '../models';

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

  setTokens(tokens: Tokens): void {
    window.localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  async getTokens(): Promise<Tokens> {
    let tokens: Tokens = JSON.parse(window.localStorage.getItem('tokens') as string);

    if (!tokens) {
      throw new Error('No tokens found! You must sign in first.');
    }

    if (tokens.expires_at < Date.now() + 600000) {
      console.log(
        `Token expires soon (${new Date(tokens.expires_at).toISOString()}), refreshing...`
      );
      await this.refresh(tokens.refresh_token);
      tokens = JSON.parse(window.localStorage.getItem('tokens') as string);
    }

    return tokens;
  }

  async fetchTokensFromQRCode(): Promise<void> {
    const qrCode = new KaiOS.QRCode();
    const text = await qrCode.readAsText();
    this.setTokens(JSON.parse(text));
  }

  fetchTokensFromCode(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
    }).then((tokens: Tokens) => this.setTokens(tokens));
  }

  private refresh(refreshToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
          refreshToken,
        })
      );
    }).then((tokens: Tokens) => this.setTokens(tokens));
  }
}
