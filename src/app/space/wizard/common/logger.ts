import { Injectable } from '@angular/core';

let formatConsole: boolean = true;

export interface ILogEntry {
  message: string;
  warning?: boolean;
  error?: boolean;
  info?: boolean;
  inner?: any;
  origin?: string;
}
export interface ILoggerDelegate {
  (options: string | ILogEntry, ...args): void;
}
/*
 * This is just a quick and dirty functional style logger allowing for unique logger 'instances'
 * for each class
 */

@Injectable()
export class LoggerFactory {

  private styles = {

    origin: `
      background:linear-gradient(#444, #333);
      color:lime;
      font-style:italic;
      padding:0 5px;
      margin:0 0;
      `,
    instance: `
      background:linear-gradient(#444, #333);
      color:orangered;
      padding:0 5px;
      margin:0 0;
      `,
    message: `
      background:linear-gradient(#444, #333);
      color:white;
      padding:0 5px;
      margin:0 0;
      `
  };

  constructor() {
    let fmt = formatConsole === true ? '%c' : '';
    let msg = `${fmt}${this.constructor.name} ${fmt}New instance ...`;
    if (fmt.length > 0) {
      console.log(msg, this.styles.origin, this.styles.message);
    } else {
      console.log(msg);
    }
  }

  createLoggerDelegate(origin: string, instance: number = 0): ILoggerDelegate {
    let me = this;

    function addLogEntry(entry: ILogEntry, ...args) {
      let method = 'log';
      if (entry.error === true) {
        method = 'error';
      }
      if (entry.warning === true) {
        method = 'warn';
      }
      if (entry.info === true) {
        method = 'info';
      }
      let fmt = formatConsole === true ? '%c' : '';
      let msg = `${fmt}${origin}${fmt} ${instance} ${fmt}${entry.message || ''}`;
      let functionArgs = args.filter(a => typeof(a) === 'function');
      let otherArgs = args.filter(a => typeof(a) !== 'function');
      let newArgs = [msg, ...otherArgs];
      if (fmt.length > 0) {
        newArgs = [msg, me.styles.origin, me.styles.instance, me.styles.message, ...otherArgs];
      }
      if (functionArgs.length > 0) {
        functionArgs[0].apply(null, newArgs);
      } else {
        console[method].apply(null, newArgs);
      }
    }

    function loggerDelegate(options: string | ILogEntry, ...args) {
      let entry = { message: '' };
      if (typeof options === 'string') {
        entry.message = options || '';
      } else {
        Object.assign(entry, options);
      }
      addLogEntry(entry, ...args);
    }

    return loggerDelegate;
  }
}

