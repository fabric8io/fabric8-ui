import React from 'react';

// loading the AngularModuleRenderer must come first
import AngularModuleRenderer from '../angular/AngularModuleRenderer';

// need to import first otherwise bootstrap styles take precedence
import 'ngx-fabric8-ui/src/vendor.browser';

// eslint-disable-next-line import/order
import { AppModule } from 'ngx-fabric8-ui/src/app';

const AngularFabric8UI: React.SFC = () => (
  <AngularModuleRenderer
    selector="f8-app"
    compilerOptions={{
      preserveWhitespaces: true,
    }}
    module={AppModule}
  />
);

export default AngularFabric8UI;
