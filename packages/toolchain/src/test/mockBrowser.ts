/* eslint-disable no-underscore-dangle */

function createMockStorage() {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

export const mockLocalStorage = () =>
  ((window: any) => {
    if (typeof window._localStorage !== 'undefined') {
      window._localStorage = createMockStorage();
    } else if (typeof window.localStorage !== 'undefined') {
      window.localStorage = createMockStorage();
    }
  })(window);

export const mockSessionStorage = () =>
  ((window: any) => {
    if (typeof window._sessionStorage !== 'undefined') {
      window._sessionStorage = createMockStorage();
    } else if (typeof window.sessionStorage !== 'undefined') {
      window.sessionStorage = createMockStorage();
    }
  })(window);

export const mockLocation = (location?: {
  hash?: string;
  port?: number;
  pathname?: string;
  search?: string;
  origin?: string;
}) =>
  ((window: any) => {
    const windowLocation = JSON.stringify(window.location);
    delete window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: JSON.parse(windowLocation),
    });
    if (location) {
      Object.assign(window.location, location);
    }
  })(window);
