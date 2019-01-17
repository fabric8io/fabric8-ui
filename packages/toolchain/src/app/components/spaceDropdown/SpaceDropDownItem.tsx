import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from '../../redux/utils';
import DropdownItemRoute from '../DropdownItemRoute';
import { AppState } from '../../redux/appState';
import { getSpaceById, getUserById } from '../../redux/wit/selectors';
import { fetchSpaceOwner } from '../../redux/wit/actions';

interface SpaceDropdownItemProps {
  spaceId: string;
  subPath?: string;
}

type StateProps =
  | {
      ownername: string;
      spacename: string;
      subPath?: string;
      loaded: true;
    }
  | {
      loaded: false;
    };

interface DispatchProps {
  fetchSpaceOwner(): void;
}

type Props = SpaceDropdownItemProps & StateProps & DispatchProps;

class SpaceDropdownItem extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.props.fetchSpaceOwner();
  }

  render() {
    if (this.props.loaded) {
      const { ownername, spacename, subPath } = this.props;
      return (
        <DropdownItemRoute href={`/${ownername}/${spacename}${subPath ? `/${subPath}` : ''}`}>
          {spacename}
        </DropdownItemRoute>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: AppState, ownProps: SpaceDropdownItemProps): StateProps => {
  const space = getSpaceById(state, ownProps.spaceId);
  if (space) {
    const ownerId = space.relationships['owned-by'].data.id;
    if (ownerId) {
      const owner = getUserById(state, ownerId);
      if (owner) {
        return {
          ownername: owner.attributes.username,
          spacename: space.attributes.name,
          subPath: ownProps.subPath,
          loaded: true,
        };
      }
    }
  }
  return {
    loaded: false,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  ownProps: SpaceDropdownItemProps,
): DispatchProps => ({
  fetchSpaceOwner: () => dispatch(fetchSpaceOwner(ownProps.spaceId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpaceDropdownItem);
