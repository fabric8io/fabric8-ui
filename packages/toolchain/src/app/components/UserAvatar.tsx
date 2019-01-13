import React from 'react';
import { Avatar } from '@osio/widgets';

export interface UserAvatarProps {
  name?: string;
  username: string;
  avatarSrc?: string;
}

const UserAvatar: React.SFC<UserAvatarProps> = ({ name, username, avatarSrc }: UserAvatarProps) => {
  let alt = `(${username})`;
  if (name) {
    alt = `${name} ${alt}`;
  }
  return <Avatar src={avatarSrc} alt={alt} title={alt} />;
};

export default UserAvatar;
