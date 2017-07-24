export let context = {
  "space": {
    "attributes": {
      "created-at": "2017-07-07T14:56:58.017598Z",
      "description": "",
      "name": "july7",
      "updated-at": "2017-07-07T14:56:58.017598Z",
      "version": 0
    },
    "id": "413ef915-b3a2-40d6-8c35-9b748b73cb80",
    "links": {
      "backlog": {
        "meta": {
          "totalCount": 0
        },
        "self": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/backlog"
      },
      "filters": "https://api.openshift.io/api/filters",
      "self": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80",
      "workitemlinktypes": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/workitemlinktypes",
      "workitemtypes": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/workitemtypes"
    },
    "relationships": {
      "areas": {
        "links": {
          "related": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/areas"
        }
      },
      "codebases": {
        "links": {
          "related": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/codebases"
        }
      },
      "collaborators": {
        "links": {
          "related": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/collaborators"
        }
      },
      "iterations": {
        "links": {
          "related": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/iterations"
        }
      },
      "owned-by": {
        "data": {
          "id": "4a7e3d5f-6a8f-460b-9a3e-9913e64af94d",
          "type": "identities"
        },
        "links": {
          "related": "https://api.openshift.io/api/users/4a7e3d5f-6a8f-460b-9a3e-9913e64af94d"
        }
      },
      "workitems": {
        "links": {
          "related": "https://api.openshift.io/api/spaces/413ef915-b3a2-40d6-8c35-9b748b73cb80/workitems"
        }
      }
    },
    "type": "spaces",
    "relationalData": {
      "creator": {
        "attributes": {
          "bio": "",
          "company": "Red Hat",
          "contextInformation": {
            "recentContexts": [
              {
                "space": "413ef915-b3a2-40d6-8c35-9b748b73cb80",
                "user": "4a7e3d5f-6a8f-460b-9a3e-9913e64af94d"
              },
              {
                "space": null,
                "user": "4a7e3d5f-6a8f-460b-9a3e-9913e64af94d"
              }
            ],
            "recentSpaces": [
              "413ef915-b3a2-40d6-8c35-9b748b73cb80"
            ]
          },
          "created-at": "2017-04-26T06:34:24.516884Z",
          "email": "ckrych@redhat.com",
          "fullName": "Corinne Krych",
          "identityID": "4a7e3d5f-6a8f-460b-9a3e-9913e64af94d",
          "imageURL": "https://www.gravatar.com/avatar/d4445894370ad3aeb93345b544ba1dbf.jpg",
          "providerType": "kc",
          "registrationCompleted": true,
          "updated-at": "2017-07-10T14:52:12.740298Z",
          "url": "",
          "userID": "d9fafc3e-b342-4ed1-9953-95acb1791be3",
          "username": "ckrych@redhat.com"
        },
        "id": "4a7e3d5f-6a8f-460b-9a3e-9913e64af94d",
        "links": {
          "self": "https://api.openshift.io/api/users/4a7e3d5f-6a8f-460b-9a3e-9913e64af94d"
        },
        "type": "identities"
      }
    }
  },
  "name": "july7",
  "path": "/ckrych@redhat.com/july7"
};

export let choice = {
  "index": 0,
  "id": "Release",
  "name": "Release",
  "description": "Release",
  "visible": true,
  "isDefault": false,
  "selected": false
};

export let source = [
  {
    "id": "Release",
    "builder": "maven",
    "descriptionMarkdown": "Maven based pipeline which:\n\n* creates a new version then builds and deploys the project into the maven repository\n* runs an integration test in the **Test** environment\n",
    "environments": [
      "Test"
    ],
    "label": "Release",
    "stages": [
      "Build Release",
      "Integration Test"
    ],
    "value": "maven/Release/Jenkinsfile"
  }
];
