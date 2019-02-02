import { gravatar } from './gravatar';

function extractParams(from) {
  let f = from;
  const params: object = {};
  f = f.split('?').pop();
  f = f.split('&');
  for (const i in f) {
    if (i && f[i]) {
      const t = f[i].split('=');
      params[t[0]] = t[1];
    }
  }
  return params;
}

describe('gravatar', () => {
  const email = 'me@me.com';

  const confirmed_md5 = 'f620f4647fb816073c9152a284245e64';

  it('Should let me call gravatar function', () => {
    expect(gravatar).toBeDefined();
  });

  it('Should calculate the md5 correctly and setup sensible defaults', () => {
    expect(gravatar(email)).toEqual(`http://www.gravatar.com/avatar/${confirmed_md5}?r=g&s=100`);
  });

  it('Should standardize the email addresses', () => {
    expect(gravatar('me@me.com')).toEqual(gravatar(' Me@mE.com'));
  });

  it('Should let me specify the size', () => {
    const pic: any = extractParams(gravatar(email, { size: '200' }));
    expect(pic.s).toEqual('200');
  });

  it('Should let me specify the rating', () => {
    const pic: any = extractParams(gravatar(email, { rating: 'pg' }));
    expect(pic.r).toEqual('pg');
  });

  it('Should let me specify a gravatar default', () => {
    const pic: any = extractParams(gravatar(email, { backup: 'retro' }));
    expect(pic.d).toEqual('retro');
  });

  it('Should let me specify my own image as a default', () => {
    const pic: any = extractParams(
      gravatar(email, { backup: 'http://example.com/images/avatar.jpg' }),
    );
    expect(pic.d).toEqual('http%3A%2F%2Fexample.com%2Fimages%2Favatar.jpg');
  });

  it('Should let me specify that a url should be secure', () => {
    const url: string = gravatar(email, { secure: true });
    expect(url.indexOf('https://secure.gravatar')).toEqual(0);
  });
});
