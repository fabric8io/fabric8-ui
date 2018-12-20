require('@osio/scripts/config/jest/jasmine.shim');

/**
 * ISSUE: https://github.com/thymikee/jest-preset-angular/issues/170
 * Workaround: https://github.com/angular/angular/issues/24094
 */
if (document.body.style.animation === undefined && CSSStyleDeclaration) {
  CSSStyleDeclaration.prototype.animation = '';
}

if (document.body.style['animation-name'] === undefined && CSSStyleDeclaration) {
  CSSStyleDeclaration.prototype['animation-name'] = '';
  CSSStyleDeclaration.prototype.animationName = '';
}

if (document.body.style['animation-duration'] === undefined && CSSStyleDeclaration) {
  CSSStyleDeclaration.prototype['animation-duration'] = '';
  CSSStyleDeclaration.prototype.animationDuration = '';
}

if (document.body.style['animation-play-state'] === undefined && CSSStyleDeclaration) {
  CSSStyleDeclaration.prototype['animation-play-state'] = '';
  CSSStyleDeclaration.prototype.animationPlayState = '';
}

require('@osio/scripts/config/jest/setup.angular');
