import { User } from './user';

export class Comment {
    id: string;
    type: string;
    attributes: CommentAttributes;
    relationships: {
        'created-by': {
            data: {
              id: string;
              type: string;
            };
        },
    };
    relationalData?: RelationalData;
}

export class CommentAttributes {
    body: string;
    'created-at': string;
}

export class Comments {
    data: Comment[];
}

export class CommentPost {
    data: Comment;
}

export class RelationalData {
  creator?: User;
}
