import React, { ReactNode, SFC } from 'react';
import { Button as PButton, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { OneOf } from '../../typeUtils';

export { ButtonType, ButtonVariant };

export interface ButtonProps {
  children?: ReactNode;
  isBlock?: boolean;
  isDisabled?: boolean;
  variant?: OneOf<typeof ButtonVariant, keyof typeof ButtonVariant>;
  type?: OneOf<typeof ButtonType, keyof typeof ButtonType>;
  onClick?(event: React.MouseEvent<HTMLElement>): void;

  /**
   *
   */
  href?: string;

  /**
   * Shorthand for 'primary' variant.
   */
  isPrimary?: boolean;

  /**
   * Shorthand for 'secondary' variant.
   */
  isSecondary?: boolean;

  /**
   * Shorthand for 'tertiary' variant.
   */
  isTertiary?: boolean;

  /**
   * Shorthand for 'danger' variant.
   */
  isDanger?: boolean;

  /**
   * Shorthand for 'plain' variant.
   */
  isPlain?: boolean;

  /**
   * Shorthand for 'link' variant.
   */
  isLink?: boolean;
}

const Button: SFC<ButtonProps> = ({
  isPrimary,
  isSecondary,
  isTertiary,
  isDanger,
  isPlain,
  isLink,
  href,
  ...props
}) => (
  <PButton
    component={href ? 'a' : undefined}
    href={href}
    variant={
      isPrimary
        ? ButtonVariant.primary
        : isSecondary
        ? ButtonVariant.secondary
        : isTertiary
        ? ButtonVariant.tertiary
        : isDanger
        ? ButtonVariant.danger
        : isPlain
        ? ButtonVariant.plain
        : isLink
        ? ButtonVariant.link
        : undefined
    }
    {...props}
  />
);

export default Button;
