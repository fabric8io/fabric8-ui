import React, { ReactNode } from 'react';
import { RouteComponentProps, withRouter, matchPath } from 'react-router';
import { NavItem } from '@talamer/widgets';

export type NavRouteProps = {
  children?: ReactNode | string;
  href?: string;
  path: string;
  exact?: boolean;
};

type Props = RouteComponentProps & NavRouteProps;

export const NavRoute: React.SFC<Props> = ({
  children,
  href,
  path,
  exact,
  history,
  location,
}: Props) => (
  <NavItem
    isActive={
      !!matchPath(location.pathname, {
        path: path || href,
        exact,
      })
    }
    to={href || path}
    onClick={(e) => {
      history.push(href || path);
      e.preventDefault();
    }}
  >
    {children}
  </NavItem>
);

export default withRouter(NavRoute);
