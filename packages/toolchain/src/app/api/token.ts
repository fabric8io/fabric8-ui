export interface TokenInfo {
  // eslint-disable-next-line camelcase
  access_token: string;

  // eslint-disable-next-line camelcase
  expires_in: number;

  // eslint-disable-next-line camelcase
  refresh_expires_in: number;

  // eslint-disable-next-line camelcase
  refresh_token: string;

  // eslint-disable-next-line camelcase
  token_type: string;
}

export interface JwtToken {
  sub: string;
  name: string;
  // eslint-disable-next-line camelcase
  preferred_username: string;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token == null) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function parseTokenInfoFromQuery(search: string): TokenInfo | undefined {
  let tokenStr: string;
  const query = search.substr(1);
  query.split('&').forEach((part) => {
    const item = part.split('=');
    if (item[0] === 'token_json') {
      tokenStr = decodeURIComponent(item[1]);
    }
  });
  if (tokenStr) {
    const tokenInfo = JSON.parse(tokenStr) as TokenInfo;
    processTokenInfo(tokenInfo);
    return tokenInfo;
  }
  return undefined;
}

function processTokenInfo(token: TokenInfo): void {
  localStorage.setItem(TOKEN_KEY, token.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, token.refresh_token);
}

export function parseJwtToken(token: string): JwtToken {
  return JSON.parse(atob(token.split('.')[1]));
}
