export class Workspace {
  attributes: WorkspaceAttributes;
  links?: WorkspaceOpenLinks;
  type: string;
}

export class WorkspaceAttributes {
  description? : string;
  name?: string;
}

export class WorkspaceLinks {
  links?: {
    open?: string;
  }
}

export class WorkspaceOpenLinks {
  open?: string;
}

