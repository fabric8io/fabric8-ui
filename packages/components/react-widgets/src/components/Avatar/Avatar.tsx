import React, { SFC, SyntheticEvent } from 'react';

import { Avatar as PAvatar } from '@patternfly/react-core';

import defaultAvatar from './avatar.svg';

export interface AvatarProps {
  /** The avatar image source */
  src?: string;
  /** Alt string to display in place of image */
  alt?: string;
  /** Avatar title to display as a tooltip */
  title?: string;
}

function onError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = defaultAvatar;
}

const Avatar: SFC<AvatarProps> = ({ src, alt, title }: AvatarProps) => (
  <PAvatar src={src || defaultAvatar} alt={alt || ''} title={title} onError={onError} />
);

export default Avatar;
