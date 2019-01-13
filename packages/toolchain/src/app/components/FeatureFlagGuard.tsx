import React, { ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from '../redux/utils';
import { AppState } from '../redux/appState';
import { fetchFeatures } from '../redux/wit/actions';
import { getFeatureById } from '../redux/wit/selectors';

export interface FeatureFlagGuardProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface StateProps {
  enabled: boolean;
  loaded: boolean;
}

interface DispatchProps {
  fetchFeatures: () => void;
}

type Props = StateProps & DispatchProps & FeatureFlagGuardProps & RouteComponentProps;

export class FeatureFlagGuard extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchFeatures();
  }

  render() {
    const { enabled, children, fallback, loaded } = this.props;
    return !loaded ? null : enabled ? children : fallback;
  }
}

const mapStateToProps = (state: AppState, ownProps: FeatureFlagGuardProps): StateProps => {
  const feature = getFeatureById(state, ownProps.featureId);
  if (feature) {
    return {
      enabled: feature.attributes.enabled && feature.attributes['user-enabled'],
      loaded: true,
    };
  }
  return {
    enabled: false,
    loaded: false,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchFeatures: () => dispatch(fetchFeatures()),
});

// TODO adding withRouter due to https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/redux.md#blocked-updates
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FeatureFlagGuard),
);
