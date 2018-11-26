import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  private nativeWindow: Window;

  constructor() {
    this.nativeWindow = window;
  }

  /**
   * Get native window
   *
   * @returns {Window}
   */
  getNativeWindow(): Window {
    return this.nativeWindow;
  }

  /**
   * Open an existing window or a newly created one
   *
   * @param url The URL of the window to open
   * @param name The window name
   * @returns {Window}
   */
  open(url: string, name: string): Window {
    return this.getNativeWindow().open(url, name);
  }
}
