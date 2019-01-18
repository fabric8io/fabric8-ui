import React from 'react';
import { PageSection, PageSectionVariants, Dropdown } from '@osio/widgets';
import { connect } from 'react-redux';
import { ThunkDispatch } from '../redux/utils';
import DropdownItemRoute from './DropdownItemRoute';
import { AppState } from '../redux/appState';
import { NO_SPACE_PATH } from '../redux/context/constants';
import { fetchCurrentUserSpaces } from '../redux/wit/actions';
import { getCurrentUserSpaces, getCurrentUser } from '../redux/wit/selectors';
import { SpaceResource } from '../api/models';
import { isLoggedIn } from '../redux/authentication/selectors';

export interface SpaceDropdownPageSectionProps {
  username: string;
  spacename: string;
  subPath?: string;
}

interface StateProps {
  spaces?: SpaceResource[];
  loggedIn: boolean;
}

interface DispatchProps {
  fetchSpaces: () => void;
}

type Props = StateProps & DispatchProps & SpaceDropdownPageSectionProps;

const ALL_SPACES = 'All Spaces';

export class SpaceDropdownPageSection extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSpaces();
  }

  render() {
    const { spacename, spaces, subPath, username, loggedIn } = this.props;
    return (
      loggedIn && (
        <PageSection variant={PageSectionVariants.light} sticky padding="sm">
          Space:{' '}
          <Dropdown label={spacename || ALL_SPACES} isPlain showArrow>
            {username != null && (
              <DropdownItemRoute
                key="all"
                href={`/${username}/${NO_SPACE_PATH}${subPath ? `/${subPath}` : ''}`}
              >
                {ALL_SPACES}
              </DropdownItemRoute>
            )}
            {username != null &&
              spaces &&
              spaces.map((space) => (
                <DropdownItemRoute
                  key={space.id}
                  href={`/${username}/${space.attributes.name}${subPath ? `/${subPath}` : ''}`}
                >
                  {space.attributes.name}
                </DropdownItemRoute>
              ))}
          </Dropdown>
        </PageSection>
      )
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SpaceDropdownPageSectionProps) => {
  const loggedIn = isLoggedIn(state);
  let { username } = ownProps;
  if (username == null) {
    const user = getCurrentUser(state);
    if (user) {
      ({ username } = user.attributes);
    }
  }
  return {
    spaces: getCurrentUserSpaces(state),
    username,
    loggedIn,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchSpaces: () => dispatch(fetchCurrentUserSpaces()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpaceDropdownPageSection);
