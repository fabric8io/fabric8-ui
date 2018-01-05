export enum Operation {
  ADDED, MODIFIED, DELETED
}

export class ResourceOperation {
  constructor(public operation: Operation, public resource: any) {
  }
}

export function messageEventToResourceOperation(msg): ResourceOperation {
  if (msg instanceof ResourceOperation) {
    return msg as ResourceOperation;
  }
  if (msg instanceof MessageEvent) {
    let me = msg as MessageEvent;
    let data = me.data;
    if (data) {
      var json = JSON.parse(data);
      if (json) {
        let type = json.type;
        let resource = json.object;
        if (type && resource) {
          switch (type) {
            case "ADDED":
              return new ResourceOperation(Operation.ADDED, resource);
            case "MODIFIED":
              return new ResourceOperation(Operation.MODIFIED, resource);
            case "DELETED":
              return new ResourceOperation(Operation.DELETED, resource);
            default:
              console.log("Unknown WebSocket event type " + type + " for " + resource + " on " + this.service.serviceUrl);
          }
        }
      }
    }
  }
  return null;
}
