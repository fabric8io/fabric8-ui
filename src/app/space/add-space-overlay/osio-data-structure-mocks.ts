import { Space } from 'ngx-fabric8-wit';
import { Profile, User } from 'ngx-login-client';

export class OSIOMocks {

    createUserProfile(): Profile {
        return {
            fullName: 'mock-fullName',
            imageURL: 'mock-imageURL',
            username: 'mock-username'
        };
    }

    public createUser(): User {
        return {
            id: 'mock-id',
            attributes: this.createUserProfile(),
            type: 'mock-type'
        };
    }

    public createSpace(): Space {
        let mockUser = this.createUser();
        return {
            name: 'mock-space',
            path: 'mock-path',
            teams: [
                { name: 'mock-name', members: [mockUser] }
            ],
            defaultTeam: { name: 'mock-name', members: [mockUser] },
            id: 'mock-id',
            attributes: {
                name: 'mock-attribute',
                description: 'mock-description',
                'updated-at': 'mock-updated-at',
                'created-at': 'mock-created-at',
                version: 0
            },
            type: 'mock-type',
            links: {
                self: 'mock-self'
            },
            relationships: {
                areas: { links: { related: 'mock-related' } },
                iterations: { links: { related: 'mock-related' } },
                workitemtypegroups: { links: { related: 'mock-related' } },
                'owned-by': {
                    data: {
                        id: mockUser.id,
                        type: mockUser.type
                    }
                }
            },
            relationalData: {
                creator: mockUser
            }
        };
    }
}

export let osioMocks: OSIOMocks = new OSIOMocks();

