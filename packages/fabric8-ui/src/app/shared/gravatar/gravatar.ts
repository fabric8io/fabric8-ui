import { md5 } from './md5';

export function gravatar(email: string, options: any = {}): string {
  let opt = options;
  let e = email;
  // check to make sure you gave us something
  const params: Array<string> = [];

  // set some defaults, just in case
  opt = {
    size: opt.size || '100',
    rating: opt.rating || 'g',
    secure: opt.secure || location.protocol === 'https:',
    backup: opt.backup || '',
  };

  // setup the email address
  e = e.trim().toLowerCase();

  // determine which base to use
  const base = opt.secure
    ? 'https://secure.gravatar.com/avatar/'
    : 'http://www.gravatar.com/avatar/';

  // add the params
  if (opt.rating) {
    params.push(`r=${opt.rating}`);
  }
  if (opt.backup) {
    params.push(`d=${encodeURIComponent(opt.backup)}`);
  }
  if (opt.size) {
    params.push(`s=${opt.size}`);
  }
  // now throw it all together
  return `${base}${md5(e)}?${params.join('&')}`;
}
