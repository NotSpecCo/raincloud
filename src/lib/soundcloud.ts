import { Auth } from './auth';

type Options = {};

export class SoundCloud {
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = {
      ...options,
    };
  }

  async me() {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('GET', `https://api.soundcloud.com/me`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.access_token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });
  }
}
