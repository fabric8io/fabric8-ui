import { ProcessTemplate } from './process-template';

export interface Space {
    name: String;
    path: String;
    description: String;
    process?: ProcessTemplate;
    private?: boolean;
}
