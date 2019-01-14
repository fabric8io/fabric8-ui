import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/appState';
import UserAvatar from '../UserAvatar';
import { getCurrentUser } from '../../redux/wit/selectors';

export interface StateProps {
  fullName?: string;
  username?: string;
  imageURL?: string;
}

export const LoggedInUserAvatar: React.SFC<StateProps> = ({
  fullName,
  username,
  imageURL,
}: StateProps) =>
  username ? <UserAvatar avatarSrc={imageURL} name={fullName} username={username} /> : null;

const mapStateToProps = (state: AppState): StateProps => {
  const user = getCurrentUser(state);
  if (user) {
    const { fullName, username, imageURL } = user.attributes;
    return {
      fullName,
      username,
      imageURL,
    };
  }
  return {};
};

export default connect(mapStateToProps)(LoggedInUserAvatar);
