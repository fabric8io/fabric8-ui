import { ClassProvider, FactoryProvider, OpaqueToken } from '@angular/core';
import { LoggerFactory } from '../../common/logger';
import { Fabric8AppGeneratorService } from '../concrete/fabric8-app-generator.service';
import { AppGeneratorConfiguratorService } from '../concrete/fabric8-app-generator-configurator.service';

import { AppGeneratorService, IAppGeneratorServiceToken } from '../contracts/app-generator-service';

import { IForgeService, IForgeServiceProvider } from '../forge.service';
import { MockAppGeneratorService } from '../mocks/mock-app-generator.service';

/**
 * When using this provider and you take a dependency on the interface type
 * it will be necessary to use the @inject(IAppGeneratorServiceProvider.InjectToken)
 * annotation to resolve the dependency. Benefits are that it is a more strict
 * contract first based approach, thus allowing multiple concrete implementations
 * without requiring a base type hierarchy.
 */
export class IAppGeneratorServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: IAppGeneratorServiceToken,
      useFactory: (forge: IForgeService, loggerFactory, appGeneratorConfiguratorService) => {
        return new Fabric8AppGeneratorService(forge, loggerFactory, appGeneratorConfiguratorService);
      },
      deps: [ IForgeServiceProvider.InjectToken, LoggerFactory, AppGeneratorConfiguratorService ]
    };
  }

  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: IAppGeneratorServiceToken,
      useFactory: (loggerFactory) => {
        return new MockAppGeneratorService(loggerFactory);
      },
      deps: [ LoggerFactory ]

    };
  }

  static get InjectToken(): OpaqueToken {
    return IAppGeneratorServiceToken;
  }
}
/**
 * These providers uses the abstract base class as a contract as opposed to
 * an interface. The benefits are that it is simpler because does not require
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
    };
  }

  static get MockClassProvider(): ClassProvider {
    return {
      provide: AppGeneratorService,
      useClass: MockAppGeneratorService
    };
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory: (forge: IForgeService, loggerFactory, appGeneratorConfigurationService) => {
        return new Fabric8AppGeneratorService(forge, loggerFactory, appGeneratorConfigurationService);
      },
      deps: [ IForgeServiceProvider.InjectToken, LoggerFactory, AppGeneratorConfiguratorService ],
      multi: false
    };
  }

  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory: (loggerFactory) => {
        return new MockAppGeneratorService(loggerFactory);
      },
      deps: [ LoggerFactory ],
      multi: false
    };
  }
}



