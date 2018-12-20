import { config, LIB_NAME, PATH_DIST } from './rollup.config';

config.output.format = 'umd';
config.output.file = `${PATH_DIST + LIB_NAME}.umd.js`;

export default config;
