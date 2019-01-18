import React from 'react';
import { connect } from 'react-redux';
import { Subtract } from 'utility-types';
import { AppState } from '../redux/appState';
import { ContextState } from '../redux/context/state';
import { getContext } from '../redux/context/selectors';

export interface WithContextProps extends ContextState {}

const mapStateToProps = (state: AppState) => ({ ...getContext(state) });

const withContext = <P extends WithContextProps>(WrappedComponent: React.ComponentType<P>) => {
  class WithContext extends React.Component<WithContextProps> {
    // Enhance component name for debugging and React-Dev-Tools
    static displayName = `withContext(${WrappedComponent.name})`;

    // reference to original wrapped component
    static readonly WrappedComponent = WrappedComponent;

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  // TODO need to cast to any first otherwise it is a mismatched type
  // typescript related bug https://github.com/piotrwitek/react-redux-typescript-guide/issues/100
  return (connect(mapStateToProps)(WithContext) as any) as React.ComponentClass<
    Subtract<P, WithContextProps>
  >;
};

export default withContext;
