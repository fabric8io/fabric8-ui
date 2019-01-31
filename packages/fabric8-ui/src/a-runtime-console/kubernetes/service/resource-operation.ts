export enum Operation {
  ADDED,
  MODIFIED,
  DELETED,
}

export class ResourceOperation {
  constructor(public operation: Operation, public resource: any) {}
}

const serviceUrl = this.service.serviceUrl;

export function messageEventToResourceOperation(msg): ResourceOperation {
  if (msg instanceof ResourceOperation) {
    return msg as ResourceOperation;
  }
  if (msg instanceof MessageEvent) {
    const me = msg as MessageEvent;
    const data = me.data;
    if (data) {
      const json = JSON.parse(data);
      if (json) {
        const type = json.type;
        const resource = json.object;
        if (type && resource) {
          switch (type) {
            case 'ADDED':
              return new ResourceOperation(Operation.ADDED, resource);
            case 'MODIFIED':
              return new ResourceOperation(Operation.MODIFIED, resource);
            case 'DELETED':
              return new ResourceOperation(Operation.DELETED, resource);
            default:
              console.log(`Unknown WebSocket event type ${type} for ${resource} on ${serviceUrl}`);
          }
        }
      }
    }
  }
  return null;
}
