import React, { Component } from 'react';
import { asyncComponent } from '@osio/widgets';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createStoreProvider } from './redux/store';
import FeatureFlagGuard from './components/FeatureFlagGuard';
import Authentication from './components/Authentication';

const AsyncAppLayout = asyncComponent({
  loader: () => import('./components/appLayout/AppLayout'),
});

const AsyncAngularFabric8UI = asyncComponent({
  loader: () => import('./components/f8ui/AngularFabric8UI'),
});

const history = createBrowserHistory();
const StoreProvider = createStoreProvider(history);

export default class App extends Component {
  render() {
    return (
      <StoreProvider>
        <ConnectedRouter history={history}>
          <FeatureFlagGuard featureId="NewNavigation" fallback={<AsyncAngularFabric8UI />}>
            <Authentication />
            <AsyncAppLayout />
          </FeatureFlagGuard>
        </ConnectedRouter>
      </StoreProvider>
    );
  }
}
