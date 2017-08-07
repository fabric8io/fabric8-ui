export interface IForgeCommandPipeline {
  name: string;
  step: {
    name: string;
    index?: number;
  };
}
