
export interface IAppGeneratorCommand {
  name: string;
  parameters?: {
    workflow: {
      step: {
        name: string
        [key: string]: any;
      },
      [key: string]: any;
    }|any;
    data?: any,
    inputs?: any
    [key: string]: any;

  }
}

