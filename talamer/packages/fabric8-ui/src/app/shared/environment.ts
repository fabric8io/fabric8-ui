export enum Environment {
  production = 'production',
  prodPreview = 'prod-preview',
  development = 'development',
  prDeploy = 'prDeploy'
}

export function getEnvironment(): Environment {
  const currentUrl = window.location.href;
  let environment = Environment.production;
  if (currentUrl.indexOf('prod-preview') > -1) {
    environment = Environment.prodPreview;
  } else if (currentUrl.indexOf('localhost') > -1) {
    environment = Environment.development;
  } else if (currentUrl.indexOf('badger') > -1) {
    environment = Environment.prDeploy;
  }
  return environment;
}
