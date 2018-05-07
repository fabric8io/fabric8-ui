import { filterOutClosedItems } from './workitem-utils';

describe('Workitem utils: it', () => {

  const inplist = [{
    id: 'id-1',
    attributes: {
      'system.state': 'removed'
    }
  }, {
    id: 'id-2',
    attributes: {
      'system.state': 'closed'
    }
  }, {
    id: 'id-3',
    attributes: {
      'system.state': 'done'
    }
  }, {
    id: 'id-4',
    attributes: {
      'system.state': 'new'
    }
  }];

  const outputlist = [{
    id: 'id-4',
    attributes: {
      'system.state': 'new'
    }
  }];

  it('closed work items should be filtered out from the list', () => {
    expect(filterOutClosedItems(inplist)).toEqual(outputlist);
  });
});
