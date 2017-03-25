import { FactoryProvider, ClassProvider,OpaqueToken } from '@angular/core';


import {IWorkflowToken,IWorkflow} from '../contracts/workflow'
import {Workflow} from '../concrete/workflow'
import {LoggerFactory} from '../../common/logger'

/**
 * When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IWorkflowProvider.InjectToken)
 * annotation to resolve the dependency. Benefits are that it is a more strict
 * contract first based approach, thus allowing multiple concrete implementations
 * without requiring a base type hierarchy.
 */

export class IWorkflowProvider {
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: IWorkflowToken,
      useFactory:(loggerFactory)=>{
        return new Workflow(loggerFactory);
      },
      deps:[LoggerFactory]


    }
  }
  static get InjectToken(): OpaqueToken {
    return IWorkflowToken;
  }
}
/**
 * These providers uses the abstract base class as a contract as opposed to
 * an interface. The benefits are that it is simpler becaus does not require
 * using the @inject annotation to resolved the contract when  a class that
 * takes the service as a dependency. As typescript adds interface reflective
 * capabilities the interface based approach will probably be the preferred
 * approach as it lends itself to strong decoupling.
 */
export class WorkflowProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: Workflow,
      useClass: Workflow
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: Workflow,
      useFactory: (loggerFactory)=>{
        return new Workflow(loggerFactory);
      },
      deps:[LoggerFactory],
      multi: false
    }
  }
}



