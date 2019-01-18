import * as fs from 'fs';
import { browser } from 'protractor';

export enum BrowserMode {
  Phone,
  Tablet,
  Desktop,
}

export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => n * seconds(60);

export const DEFAULT_WAIT = seconds(60);
export const LONG_WAIT = minutes(3);
export const LONGER_WAIT = minutes(10);
export const LONGEST_WAIT = minutes(30);

export async function setBrowserMode(mode: BrowserMode) {
  let window = browser.driver.manage().window();
  switch (mode) {
    case BrowserMode.Phone:
      await window.setSize(430, 667);
      break;
    case BrowserMode.Tablet:
      await window.setSize(768, 1024);
      break;
    case BrowserMode.Desktop:
      await window.setSize(1920, 1080);
      break;
    default:
      throw Error('Unknown mode');
  }
}

export async function desktopTestSetup() {
  await setBrowserMode(BrowserMode.Desktop);
}

/*
 * The function uses auth and refresh tokens to login
 */
export async function loginWithTokens() {
  // Bypass login by supplying auth and refresh token
  browser.get(browser.baseUrl + '/?token_json=' + browser.token);
}
/*
 * Joins the arguments as URI paths ensuring there's exactly one '/' between each path entry
 */
export function joinURIPath(...args: string[]) {
  // TODO: improve this method using available modules for uri operations

  let answer = null;
  for (let i = 0, j = arguments.length; i < j; i++) {
    let arg = arguments[i];
    if (i === 0 || !answer) {
      answer = arg;
    } else {
      if (!answer.endsWith('/')) {
        answer += '/';
      }
      if (arg.startsWith('/')) {
        arg = arg.substring(1);
      }
      answer += arg;
    }
  }
  return answer;
}

/**
 * Write screenshot to file
 * Example usage:
 *   support.writeScreenshot('exception1.png');
 *
 * Ref: http://blog.ng-book.com/taking-screenshots-with-protractor/
 */
export async function writeScreenshot(filename: string) {
  let png = await browser.takeScreenshot();
  let stream = fs.createWriteStream(filename);
  stream.write(new Buffer(png, 'base64'));
  stream.end();
  info(`Saved screenshot to: ${filename}`);
}

function timestamp(): string {
  let date = new Date();
  let time = date.toLocaleTimeString('en-US', { hour12: false });
  let ms = (date.getMilliseconds() + 1000).toString().substr(1);
  return `${time}.${ms}`;
}

function debugEnabled(...msg: any[]) {
  console.log(`[${timestamp()}]:`, ...msg);
}

function debugNoop(...msg: any[]) {}

export function info(...msg: any[]) {
  console.info(`[${timestamp()}]:`, ...msg);
}

export const debug = process.env.DEBUG ? debugEnabled : debugNoop;
