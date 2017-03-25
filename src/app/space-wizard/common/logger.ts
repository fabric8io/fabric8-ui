import { Injectable } from '@angular/core';

export interface ILogEntry {
  message: string,
  warning?: boolean,
  error?: boolean,
  info?: boolean,
  inner?: any
}
export interface ILoggerDelegate {
  (options: string | ILogEntry): void
}
/** 
 * This is just a quick and dirty functional style logger allowing for unqique logger 'instances'
 * for each class 
 */

@Injectable()
export class LoggerFactory {
  constructor(){
    console.log("%cLoggerFactory: %cNew instace.",this.styles.origin,this.styles.message)
  }
  styles={
    origin:"background:linear-gradient(#444, #333); border-radius:15px;padding:4px;color:lime;font-style:italic;border-left:solid 0px orangered;padding:3px;padding-left:10px;padding-right:10px",
    instance: "background:linear-gradient(#444, #333);color:orangered; border-radius:10px;padding:3px;margin:3px 0;",
    message: "background:linear-gradient(#444, #333);color:white; border-radius:10px;padding:3px 10px;",

  }
  
  createLoggerDelegate(origin: string, instance: number = 0): ILoggerDelegate {
    let me=this;
    console.info(`%cLoggerFactory:%cCreating new logger for ${origin}...`,me.styles.origin,me.styles.message);
    function addLogEntry(entry: ILogEntry) {
      let method = "log";
      if (entry.error === true) {
        method = "error";
      }
      if (entry.warning === true) {
        method = "warn";
      }
      if (entry.info === true) {
        method = "info";
      }
      console[method].apply(null, [`%c${origin}%c ${instance} %c${entry.message || ""}`, me.styles.origin,me.styles.instance, me.styles.message]);
    };
    function loggerDelegate(options: string | ILogEntry) {
      let entry = { message: "" };
      if (typeof options === "string") {
        entry.message = options || "";
      }
      else {
        Object.assign(entry, options);
      }
      addLogEntry(entry);
    };
    return loggerDelegate;
  }
}

