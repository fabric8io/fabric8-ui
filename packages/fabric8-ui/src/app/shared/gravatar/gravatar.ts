import { md5 } from './md5';

export function gravatar(email: string, options: any = {}): string {
  //check to make sure you gave us something
  let base: string;
  const params: Array<string> = [];

  //set some defaults, just in case
  options = {
    size: options.size || '100',
    rating: options.rating || 'g',
    secure: options.secure || (location.protocol === 'https:'),
    backup: options.backup || ''
  };

  //setup the email address
  email = email.trim().toLowerCase();

  //determine which base to use
  base = options.secure ? 'https://secure.gravatar.com/avatar/' : 'http://www.gravatar.com/avatar/';

  //add the params
  if (options.rating) {
    params.push(`r=${options.rating}`);
  }
  if (options.backup) {
    params.push(`d=${encodeURIComponent(options.backup)}`);
  }
  if (options.size) {
    params.push(`s=${options.size}`);
  }
  //now throw it all together
  return `${base}${md5(email)}?${params.join('&')}`;
}
