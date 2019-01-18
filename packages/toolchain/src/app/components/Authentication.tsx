import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from '../redux/utils';
import { loginCheck } from '../redux/authentication/actions';

interface DispatchProps {
  loginCheck(): void;
}

export class Authentication extends React.Component<DispatchProps> {
  constructor(props: DispatchProps) {
    super(props);
    props.loginCheck();
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  loginCheck: () => dispatch(loginCheck()),
});

export default connect(
  null,
  mapDispatchToProps,
)(Authentication);
