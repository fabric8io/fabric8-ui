import React, { ReactNode } from 'react';
import { RouteComponentProps, withRouter, matchPath } from 'react-router';
import { NavExpandable } from '@talamer/widgets';

export type NavRouteGroupProps = {
  children?: ReactNode;
  title: string;
  path: string;
};

type Props = RouteComponentProps & NavRouteGroupProps;

export const NavRouteGroup: React.SFC<Props> = ({ children, path, title, location }: Props) => {
  const isActive = !!matchPath(location.pathname, {
    path,
  });
  return (
    <NavExpandable isExpanded={isActive} isActive={isActive} title={title}>
      {children}
    </NavExpandable>
  );
};

export default withRouter(NavRouteGroup);
