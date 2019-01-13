import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownPosition, Button } from '@osio/widgets';
import { ThunkDispatch } from '../../redux/utils';
import { getLoginAuthorizeUrl } from '../../api/api-urls';
import DropdownItemRoute from '../DropdownItemRoute';
import { AppState } from '../../redux/appState';
import { login, logout } from '../../redux/authentication/actions';
import { getCurrentUser } from '../../redux/wit/selectors';
import { isLoggedIn } from '../../redux/authentication/selectors';

interface StateProps {
  fullName?: string;
  username?: string;
  loggedIn: boolean;
}

interface DispatchProps {
  logout(): void;
  login(): void;
}

type Props = StateProps & DispatchProps;

export const HeaderMenuUser: React.SFC<Props> = ({
  fullName,
  username,
  loggedIn,
  logout,
  login,
}: Props) => {
  if (!loggedIn) {
    return (
      <Button
        isPlain
        href={getLoginAuthorizeUrl()}
        onClick={(e) => {
          e.preventDefault();
          login();
        }}
      >
        Log In
      </Button>
    );
  }
  const usernamePath = `/${username}`;
  // TODO PF4-react adds hrefs to button items !?!?
  return (
    <Dropdown showArrow isPlain label={fullName} position={DropdownPosition.left}>
      <DropdownItemRoute href={`${usernamePath}/_profile`}>Profile</DropdownItemRoute>
      <DropdownItemRoute href={`${usernamePath}/_settings`}>Settings</DropdownItemRoute>
      <DropdownItem onClick={logout}>Logout</DropdownItem>
    </Dropdown>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  const loggedIn = isLoggedIn(state);
  const user = getCurrentUser(state);
  if (user) {
    const { fullName, username } = user.attributes;
    return {
      fullName,
      username,
      loggedIn,
    };
  }
  return {
    loggedIn,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps =>
  bindActionCreators(
    {
      login,
      logout,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderMenuUser);
