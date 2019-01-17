import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavList } from '@osio/widgets';
import NavRoute from './NavRoute';
import { AppState } from '../../redux/appState';
import withContext, { WithContextProps } from '../../hoc/withContext';
import NavRouteGroup from './NavRouteGroup';
import { getCurrentUser } from '../../redux/wit/selectors';

interface StateProps {
  authUsername: string;
}

type Props = StateProps & WithContextProps;

// TODO why pf4... why!?!
// abstract unwanted functionality in `widgets`
const noop = () => {};

const Navigation: React.SFC<Props> = ({
  authUsername,
  username,
  spacename,
  spacenamePath,
}: Props) => {
  const userSegment = username || authUsername;
  const userSpacePath = userSegment ? `/${userSegment}/${spacenamePath}` : null;
  return (
    <Nav onSelect={noop} onToggle={noop} aria-label="Main navigation">
      <NavList>
        <NavRoute path={username && spacename ? userSpacePath : '/_home'} exact>
          Overview
        </NavRoute>
        {userSpacePath && (
          <>
            {/* <NavRoute path={userSpacePath} exact>
          Applications
        </NavRoute> */}
            <NavRoute path={`${userSpacePath}/create/pipelines`} exact>
              Pipelines
            </NavRoute>
            <NavRoute path={`${userSpacePath}/create`} exact>
              Code
            </NavRoute>
            <NavRouteGroup title="Plan" path={`${userSpacePath}/plan`}>
              <NavRoute path={`${userSpacePath}/plan`} exact>
                Backlog
              </NavRoute>
              <NavRoute path={`${userSpacePath}/plan/board`} exact>
                Board
              </NavRoute>
              <NavRoute path={`${userSpacePath}/plan/query`} exact>
                Query
              </NavRoute>
            </NavRouteGroup>
          </>
        )}
        {authUsername && (
          <NavRoute path={`/${userSegment}/_spaces`} exact>
            Spaces
          </NavRoute>
        )}
      </NavList>
    </Nav>
  );
};

const mapStateToProps = (state: AppState) => {
  const user = getCurrentUser(state);
  return {
    authUsername: user ? user.attributes.username : null,
  };
};

export default withContext(connect(mapStateToProps)(Navigation));
