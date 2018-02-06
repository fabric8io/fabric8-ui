import { cloneDeep } from 'lodash';
import { ContextTypes } from 'ngx-fabric8-wit';
import { context1 } from '../../shared/context.service.mock';
import { MenusService } from './menus.service';

describe('MenuService service: it', () => {
  let menusService: MenusService;
    const featuresEnabled = [
    {
      'attributes': {
        'user-enabled': true,
        'enabled': true,
        'enablement-level': 'internal',
        'description': 'boo',
        'name': 'Planner'
      },
      'id': 'Planner'
    },
    {
      'attributes': {
        'user-enabled': true,
        'enabled': true,
        'enablement-level': 'beta',
        'description': 'boo',
        'name': 'Environments'
      },
      'id': 'Environments'
    }
  ];
  const fullMenu = [
      {
        'name':  '',
        'path':  'settings',
        'icon':  'pficon pficon-settings',
        'menus': [
          {
            'name':  'Areas',
            'path':  '',
            'icon':  '',
            'menus': [],
            'fullPath':  '/ckrych@redhat.com/test2/settings'
          },
          {
            'name':  'Collaborators',
            'path':  'collaborators',
            'fullPath':  '/ckrych@redhat.com/test2/settings/collaborators'
          }
        ],
        'fullPath':  '/ckrych@redhat.com/test2/settings'
      },
      {
        'name':  'Analyze',
        'path':  '',
        'fullPath':  '/ckrych@redhat.com/test2'
      },
      {
        'name':  'Plan',
        'feature':  'Planner',
        'path':  'plan',
        'menus': [
          {
            'name':  'Backlog',
            'path':  '',
            'fullPath':  '/ckrych@redhat.com/test2/plan'
          },
          {
            'name':  'Board',
            'path':  'board',
            'fullPath':  '/ckrych@redhat.com/test2/plan/board'
          }
        ],
        'fullPath':  '/ckrych@redhat.com/test2/plan'
      },
      {
        'name':  'Create',
        'path':  'create',
        'menus': [
          {
            'name':  'Codebases',
            'path':  '',
            'fullPath':  '/ckrych@redhat.com/test2/create'
          },
          {
            'name':  'Pipelines',
            'path':  'pipelines',
            'fullPath':  '/ckrych@redhat.com/test2/create/pipelines'
          },
          {
            'name':  'Applications',
            'feature':  'Application',
            'path':  'apps',
            'fullPath':  '/ckrych@redhat.com/test2/create/apps'
          },
          {
            'name':  'Environments',
            'feature':  'Environments',
            'path':  'environments',
            'fullPath':  '/ckrych@redhat.com/test2/create/environments'
          },
          {
            'name':  'Deployments',
            'feature':  'Deployments',
            'path':  'deployments',
            'fullPath':  '/ckrych@redhat.com/test2/create/deployments'
          }
        ],
        'fullPath':  '/ckrych@redhat.com/test2/create'
      }
    ];
  beforeEach(() => {
    menusService = new MenusService();
  });

  it('should return a fullMenu if none of the feature are disabled', () => {
    // given
    let myContext = cloneDeep(context1);
    myContext.type = ContextTypes.BUILTIN.get('space');
    myContext.user['features'] = featuresEnabled;
    // when
    menusService.attach(myContext);
    // then
    expect(myContext.type['menus'].length).toEqual(fullMenu.length);
  });

  it('should return a filtered menu if some features (part of main menu) are disabled', () => {
    // given
    let myContext = cloneDeep(context1);
    myContext.type = ContextTypes.BUILTIN.get('space');
    let featuresPlannerDisabled = cloneDeep(featuresEnabled);
    featuresPlannerDisabled[0].attributes.enabled = false;
    myContext.user['features'] = featuresPlannerDisabled;
    // when
    menusService.attach(myContext);
    // then
    expect(myContext.type['menus'].length).toEqual(fullMenu.length - 1);
  });

  it('should return a filtered sub-menu if some features (part of submenu) are disabled', () => {
    // given
    let myContext = cloneDeep(context1);
    myContext.type = ContextTypes.BUILTIN.get('space');
    let featuresEnvironmentsDisabled = cloneDeep(featuresEnabled);
    featuresEnvironmentsDisabled[1].attributes.enabled = false;
    myContext.user['features'] = featuresEnvironmentsDisabled;
    // when
    let res = menusService.attach(myContext);
    // then
    expect(myContext.type['menus'].length).toEqual(fullMenu.length);

    let menus = myContext.type['menus'];
    let createMenu = menus[3];
    expect(createMenu.menus.length).toEqual(4);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Environments').length == 0);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Codebases').length == 1);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Pipelines').length == 1);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Applications').length == 1);
  });

  it('should return a filtered sub-menu if some features are internal and user in non internal', () => {
    // given
    let myContext = cloneDeep(context1);
    myContext.type = ContextTypes.BUILTIN.get('space');
    let featuresEnvironmentsDisabled = cloneDeep(featuresEnabled);
    featuresEnvironmentsDisabled[1].attributes['enablement-level'] = null;
    myContext.user['features'] = featuresEnvironmentsDisabled;
    // when
    let res = menusService.attach(myContext);
    // then
    expect(myContext.type['menus'].length).toEqual(fullMenu.length);

    let menus = myContext.type['menus'];
    let createMenu = menus[3];
    expect(createMenu.menus.length).toEqual(4);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Environments').length == 0);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Codebases').length == 1);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Pipelines').length == 1);
    expect(createMenu.menus.filter(subMenu => subMenu.name == 'Applications').length == 1);
  });

});
