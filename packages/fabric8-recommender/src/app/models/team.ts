import { User } from 'ngx-login-client';

export interface Team {
    name: string;
    members: User[];
}
