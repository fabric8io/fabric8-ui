import React from 'react';
import { PageSection, PageSectionVariants, Dropdown } from '@osio/widgets';
import { connect } from 'react-redux';
import DropdownItemRoute from './DropdownItemRoute';
import { AppState } from '../redux/appState';
import { NO_SPACE_PATH } from '../redux/context/constants';
import { fetchCurrentUserSpaces, fetchUserSpacesByUsername } from '../redux/wit/actions';
import { getCurrentUserSpaces, getCurrentUser, getUserSpaces } from '../redux/wit/selectors';
import { SpaceResource } from '../api/models';
import SpaceDropDownItem from './spaceDropdown/SpaceDropDownItem';

export interface SpaceDropdownPageSectionProps {
  username?: string;
  spacename?: string;
  subPath?: string;
}

interface StateProps {
  spaces?: SpaceResource[];
  username?: string;
  isAuthUser: boolean;
}

interface DispatchProps {
  dispatch(action: () => void): void;
}

interface MergeProps {
  spaces?: SpaceResource[];
  username?: string;
  spacename?: string;
  subPath?: string;
  fetchSpaces?(): void;
}

type Props = MergeProps & SpaceDropdownPageSectionProps;

const ALL_SPACES = 'All Spaces';

export class SpaceDropdownPageSection extends React.Component<Props> {
  componentDidMount() {
    if (this.props.fetchSpaces) {
      this.props.fetchSpaces();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.username !== this.props.username && this.props.fetchSpaces) {
      this.props.fetchSpaces();
    }
  }

  render() {
    const { spacename, spaces, subPath, username } = this.props;
    return (
      <PageSection variant={PageSectionVariants.light} sticky padding="sm">
        Space:{' '}
        <Dropdown label={spacename || ALL_SPACES} isPlain showArrow>
          {username != null && (
            <DropdownItemRoute
              key="_all"
              // if there is no subPath we must go to the root
              href={subPath ? `/${username}/${NO_SPACE_PATH}${subPath}` : ''}
            >
              {ALL_SPACES}
            </DropdownItemRoute>
          )}
          {spaces &&
            spaces.map((space) => (
              <SpaceDropDownItem key={space.id} spaceId={space.id} subPath={subPath} />
            ))}
        </Dropdown>
      </PageSection>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SpaceDropdownPageSectionProps): StateProps => {
  let { username } = ownProps;
  const user = getCurrentUser(state);
  if (user) {
    const isAuthUser = username === user.attributes.username;
    if (username == null) {
      ({ username } = user.attributes);
      return {
        spaces: getCurrentUserSpaces(state),
        username,
        isAuthUser: true,
      };
    }

    return {
      spaces: isAuthUser ? getCurrentUserSpaces(state) : getUserSpaces(state, username),
      username,
      isAuthUser,
    };
  }
  return {
    isAuthUser: false,
  };
};

const mapDispatchToProps = (dispatch): DispatchProps => ({
  dispatch,
});

const mergeProps = (propsFromState: StateProps, propsFromDispatch, ownProps): MergeProps => ({
  spaces: propsFromState.spaces,
  username: propsFromState.username,
  spacename: ownProps.spacename,
  subPath: ownProps.subPath,
  // how we fetch spaces depends on the user
  // for the current user, fetch all spaces they collaborate on
  // for another user, fetch only spaces they own
  fetchSpaces: propsFromState.username
    ? () =>
        propsFromDispatch.dispatch(
          propsFromState.isAuthUser
            ? fetchCurrentUserSpaces()
            : fetchUserSpacesByUsername(ownProps.username),
        )
    : null,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(SpaceDropdownPageSection);
