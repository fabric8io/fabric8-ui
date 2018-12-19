import { CommentMapper, CommentService, CommentUI } from './comment';

describe('Unit Test :: Comment Model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });

  it('should correctly convert to UI model - 1', () => {
    const cm = new CommentMapper();
    const input: CommentService = {
      id: '5cd88093-53c2-4e7a-a7ee-6a74bfbbb204',
      attributes: {
        body: 'comment',
        'body.rendered': '<p>comment</p>',
        'created-at': '2018-01-16T10:04:22.946692Z',
        markup: 'Markdown',
      },
      relationships: {
        creator: {
          data: {
            id: '5cd88093',
            type: 'identities',
          },
        },
      },
      links: {
        self: 'https://api.openshift.io/api/comments/2e7c4d7c-dd2b-465b-ad76-6115068a1184',
      },
      type: 'comments',
    };
    const output: CommentUI = cm.toUIModel(input);
    const expectedOutPut: CommentUI = {
      id: '5cd88093-53c2-4e7a-a7ee-6a74bfbbb204',
      body: 'comment',
      markup: 'Markdown',
      createdAt: '2018-01-16T10:04:22.946692Z',
      creatorId: '5cd88093',
      bodyRendered: '<p>comment</p>',
      parentId: null,
      selfLink: 'https://api.openshift.io/api/comments/2e7c4d7c-dd2b-465b-ad76-6115068a1184',
    };
    return expect(expectedOutPut).toEqual(output);
  });
});
