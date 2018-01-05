import { cloneDeep } from 'lodash';
import {
  Space,
  Context,
  Contexts,
  ContextTypes,
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';

export const loggedInUser = {
  "attributes": {
    "bio": "",
    "company": "Red Hat",
    "contextInformation": {
      "recentContexts": [
        {
          "space": null,
          "user": "aab214e7-1439-4fe7-aefc-cdee8b3cb475"
        },
        {
          "space": "5cc5ea08-9f32-49ef-901d-c2be6ca95f19",
          "user": "aab214e7-1439-4fe7-aefc-cdee8b3cb475"
        },
        {
          "space": "5444e0bc-f21e-4090-a3bc-1f0fe293a113",
          "user": "aab214e7-1439-4fe7-aefc-cdee8b3cb475"
        }],
      "recentSpaces": [
        "5444e0bc-f21e-4090-a3bc-1f0fe293a113",
        "5cc5ea08-9f32-49ef-901d-c2be6ca95f19",
        "2e028688-9ca9-4918-8ba8-451be23992f4",
        "997b85e1-fa1a-4542-82a3-4ee7d263333b"
      ]
    },
    "created-at": "2017-06-07T08:57:25.958238Z",
    "email": "ckrych@redhat.com",
    "fullName": "Corinne Krych",
    "identityID": "aab214e7-1439-4fe7-aefc-cdee8b3cb475",
    "imageURL": "https://www.gravatar.com/avatar/d4445894370ad3aeb93345b544ba1dbf.jpg",
    "providerType": "kc",
    "registrationCompleted": true,
    "updated-at": "2017-06-08T15:32:04.433694Z",
    "url": "",
    "userID": "11044ea7-bd64-49e5-927d-d5ec085ca35c",
    "username": "ckrych@redhat.com"
  },
  "id": "aab214e7-1439-4fe7-aefc-cdee8b3cb475",
  "links": { "self": "http://localhost:8080/api/users/aab214e7-1439-4fe7-aefc-cdee8b3cb475" }, "type": "identities"
};

export const profile = {
  "bio": "",
  "company": "Red Hat",
  "contextInformation": {
    "recentContexts": [
      {
        "space": null,
        "user": "aab214e7-1439-4fe7-aefc-cdee8b3cb475"
      }
    ],
    "recentSpaces": [
      "5444e0bc-f21e-4090-a3bc-1f0fe293a113",
      "5cc5ea08-9f32-49ef-901d-c2be6ca95f19",
      "2e028688-9ca9-4918-8ba8-451be23992f4",
      "997b85e1-fa1a-4542-82a3-4ee7d263333b"
    ]
  },
  "created-at": "2017-06-07T08:57:25.958238Z",
  "email": "ckrych@redhat.com",
  "fullName": "Corinne Krych",
  "identityID": "aab214e7-1439-4fe7-aefc-cdee8b3cb475",
  "imageURL": "https://www.gravatar.com/avatar/d4445894370ad3aeb93345b544ba1dbf.jpg",
  "providerType": "kc",
  "registrationCompleted": true,
  "updated-at": "2017-06-09T07:49:07.797999Z",
  "url": "",
  "userID": "11044ea7-bd64-49e5-927d-d5ec085ca35c",
  "username": "ckrych@redhat.com",
  "store": {
    "recentContexts": [
      {
        "space": null,
        "user": "aab214e7-1439-4fe7-aefc-cdee8b3cb475"
      }
    ],
    "recentSpaces": [
      "5444e0bc-f21e-4090-a3bc-1f0fe293a113",
      "5cc5ea08-9f32-49ef-901d-c2be6ca95f19",
      "2e028688-9ca9-4918-8ba8-451be23992f4",
      "997b85e1-fa1a-4542-82a3-4ee7d263333b"
    ]
  }
};

export const context1: Context = {
  user: {
    "attributes": {
      "fullName": "Corinne Krych",
      "imageURL": "https://www.gravatar.com/avatar/d4445894370ad3aeb93345b544ba1dbf.jpg",
      "username": "ckrych@redhat.com"
    },
    "id": "aab214e7-1439-4fe7-aefc-cdee8b3cb475",
    "links": {
      "self": "http://localhost:8080/api/users/aab214e7-1439-4fe7-aefc-cdee8b3cb475"
    },
    "type": "identities"
  },
  space: {
    attributes: {
      "created-at": "2017-06-08T15:18:39.270343Z",
      description: "",
      name: "space1",
      "updated-at": "2017-06-08T15:18:39.270343Z",
      version: 0
    },
    id: "1",
    name: "space1",
    path: "/ckrych@redhat.com/space1",
    teams: [],
    defaultTeam: { name: "", members: [] },
    type: "",
    links: {
      "self": "http://localhost:8080/api/spaces/5444e0bc-f21e-4090-a3bc-1f0fe293a113/backlog"
    },
    relationships: {
      areas: {
        links: {
          related: "http://localhost:8080/api/spaces/5444e0bc-f21e-4090-a3bc-1f0fe293a113/backlog"
        }
      },
      iterations: {
        links: {
          related: "http://localhost:8080/api/spaces/5444e0bc-f21e-4090-a3bc-1f0fe293a113/backlog"
        }
      },
      'owned-by': {
        data: {
          id: "",
          type: ""
        }
      }
    }
  },
  type: {
    "name": "Space",
    "icon": "fa fa-th-large"
  },
  name: "space1",
  path: "/ckrych@redhat.com/space1"
};

export const context2 = cloneDeep(context1);
context2.name = "space2";
context2.path = "/ckrych@redhat.com/space2";
context2.space.name = "space2";
context2.space.id = "2";
context2.space.path = "/ckrych@redhat.com/space2";
