import React, { ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { DropdownItem } from '@talamer/react-widgets';

export type HeaderItemProps = RouteComponentProps<any> & {
  children: ReactNode;
  href: string;
};

const DropdownItemRoute: React.SFC<HeaderItemProps> = ({
  href,
  children,
  history,
}: HeaderItemProps) => (
  <DropdownItem
    href={href}
    onClick={(e) => {
      history.push(href);
      e.preventDefault();
    }}
  >
    {children}
  </DropdownItem>
);

export default withRouter(DropdownItemRoute);
