import React from 'react';

interface State {
  loading: boolean;
}

/**
 * Basic support for code splitting components. Use with dynamic imports syntax to lazy load components.
 */
export function asyncComponent<Props = {}>(options: {
  loader: () => Promise<React.ComponentType<Props> | { default: React.ComponentType<Props> }>;
}): React.ComponentType<Props> {
  let LoadedComponent: React.ComponentType<Props>;

  class AsyncComponent extends React.Component<Props, State> {
    state: State = {
      loading: !LoadedComponent,
    };

    private unmounted = false;

    componentDidMount() {
      if (!this.state.loading) {
        return;
      }
      this.load();
    }

    componentWillUnmount() {
      this.unmounted = true;
    }

    async load() {
      const Comp = await options.loader();
      LoadedComponent = (Comp as any).default ? (Comp as any).default : Comp;
      if (!this.unmounted) {
        this.setState({ loading: false });
      }
    }

    render() {
      const { loading } = this.state;
      return loading ? null : <LoadedComponent {...this.props} />;
    }
  }

  return AsyncComponent;
}
