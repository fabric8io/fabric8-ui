import { Injectable, Injector, ReflectiveInjector } from '@angular/core';
import { ILoggerDelegate, LoggerFactory } from '../common/logger';
import { IWorkflow } from './contracts/workflow';
import { IWorkflowOptions } from './contracts/workflow-options';
import { IWorkflowProvider } from './providers/workflow.provider';
/**
 * Creates concrete implementations of the IWorkflow contract
 */
@Injectable()
export class WorkflowFactory {
  static instance: number = 1;

  constructor(private _injector: Injector, loggerFactory: LoggerFactory) {
    if ( loggerFactory ) {
      this.log = loggerFactory.createLoggerDelegate('WorkflowFactory', WorkflowFactory.instance++);
    }
    this.log(`New instance ...`);
  }

  create(options?: IWorkflowOptions): IWorkflow {
    this.log('Creating a new workflow ...');
    // Instead of using the built in injector that will create a singleton
    // create a factory and use that to resolve resulting in non singleton semantics
    // that would happen from just using this._injector.get(Workflow);
    // let tmp:IWorkflow= this._injector.get(Workflow);
    // let tmp:IWorkflow= this._injector.get(IWorkflowProvider.InjectToken);
    let prov = ReflectiveInjector.resolve([ IWorkflowProvider.FactoryProvider, LoggerFactory ]);
    let inj = ReflectiveInjector.fromResolvedProviders(prov);
    let tmp: IWorkflow = inj.get(IWorkflowProvider.InjectToken);
    if ( options ) {
      tmp.initialize(options);
    }
    return tmp;

  }

  log: ILoggerDelegate = () => {};

}
