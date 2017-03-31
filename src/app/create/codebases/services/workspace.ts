export class Workspace {
  attributes: WorkspaceAttributes;
  links?: WorkspaceLinks;
  type: string;
}

export class WorkspaceAttributes {
  description? : string;
  name?: string;
}

export class WorkspaceLinks {
  open?: string;
}
