export interface IForgeRequest {
  command: {
    name: string;
    parameters?: [ any ];
  } | any;
  payload?: any;
}
