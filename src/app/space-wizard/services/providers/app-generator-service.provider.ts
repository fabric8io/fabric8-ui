import { FactoryProvider, ClassProvider, OpaqueToken } from '@angular/core';


import { IAppGeneratorServiceToken, AppGeneratorService } from '../contracts/app-generator-service'
import { Fabric8AppGeneratorService } from '../concrete/fabric8-app-generator.service'
import { MockAppGeneratorService } from '../mocks/mock-app-generator.service'

import { IForgeServiceProvider, IForgeService } from '../forge.service'
import {LoggerFactory} from '../../common/logger'

/**
 * When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IAppGeneratorServiceProvider.InjectToken)
 * annotation to resolve the dependency. Benefits are that it is a more strict
 * contract first based approach, thus allowing multiple concrete implementations
 * without requiring a base type hierarchy.
 */
export class IAppGeneratorServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: IAppGeneratorServiceToken,
      useFactory: (forge: IForgeService,loggerFactory) => {
        return new Fabric8AppGeneratorService(forge,loggerFactory);
      },
      deps: [IForgeServiceProvider.InjectToken,LoggerFactory]
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: IAppGeneratorServiceToken,
      useFactory: (loggerFactory) => {
        return new MockAppGeneratorService(loggerFactory);
      },
      deps: [LoggerFactory]

    }
  }
  static get InjectToken(): OpaqueToken {
    return IAppGeneratorServiceToken;
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
export class FieldSetServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: AppGeneratorService,
      useClass: Fabric8AppGeneratorService
    }
  }
  static get MockClassProvider(): ClassProvider {
    return {
      provide: AppGeneratorService,
      useClass: MockAppGeneratorService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory: (forge: IForgeService,loggerFactory) => {
        return new Fabric8AppGeneratorService(forge,loggerFactory);
      },
      deps: [IForgeServiceProvider.InjectToken,LoggerFactory],
      multi: false
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory: (loggerFactory) => {
        return new MockAppGeneratorService(loggerFactory);
      },
      deps:[LoggerFactory],
      multi: false
    }
  }
}



