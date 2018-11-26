import { gravatar } from './gravatar';

function extractParams(from) {
  const params: object = {};
  from = from.split('?').pop();
  from = from.split('&');
  for (var i in from) {
    var t = from[i].split('=');
    params[t[0]] = t[1];
  }
  return params;
}

describe('gravatar', function() {

  var email = 'me@me.com',
    confirmed_md5 = 'f620f4647fb816073c9152a284245e64';

  it('Should let me call gravatar function', function() {
    expect(gravatar).toBeDefined();
  });

  it('Should calculate the md5 correctly and setup sensible defaults', function() {
    expect(gravatar(email)).toEqual('http://www.gravatar.com/avatar/' + confirmed_md5 + '?r=g&s=100');
  });

  it('Should standardize the email addresses', function() {
    expect(gravatar('me@me.com')).toEqual(gravatar(' Me@mE.com'));
  });

  it('Should let me specify the size', function() {
    const pic: any = extractParams(gravatar(email, {size: '200'}));
    expect(pic.s).toEqual('200');
  });

  it('Should let me specify the rating', function() {
    const pic: any = extractParams(gravatar(email, {rating: 'pg'}));
    expect(pic.r).toEqual('pg');
  });

  it('Should let me specify a gravatar default', function() {
    const pic: any = extractParams(gravatar(email, {backup: 'retro'}));
    expect(pic.d).toEqual('retro');
  });

  it('Should let me specify my own image as a default', function() {
    const pic: any = extractParams(gravatar(email, {backup: 'http://example.com/images/avatar.jpg'}));
    expect(pic.d).toEqual('http%3A%2F%2Fexample.com%2Fimages%2Favatar.jpg');
  });

  it('Should let me specify that a url should be secure', function() {
    const url: string = gravatar(email, {secure: true});
    expect(url.indexOf('https://secure.gravatar')).toEqual(0);
  });
});
