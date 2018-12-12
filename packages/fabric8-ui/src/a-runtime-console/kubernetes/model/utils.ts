/**
 * Joins the paths so that there is always a single '/' character between the paths
 * @param paths an array of paths
 * @return {string} the paths combined together
 */
export function pathJoin(...paths: string[]): string {
  var tmp = [];
  var length = paths.length - 1;
  paths.forEach((path, index) => {
    if (isBlank(path)) {
      return;
    }
    if (path === '/') {
      tmp.push('');
      return;
    }
    if (index !== 0 && path.match(/^\//)) {
      path = path.slice(1);
    }
    if (index !== length && path.match(/\/$/)) {
      path = path.slice(0, path.length - 1);
    }
    if (!isBlank(path)) {
      tmp.push(path);
    }
  });
  var rc = tmp.join('/');
  return rc;
}


/**
 * Returns true if the string is either null or empty
 */
export function isBlank(str: string): boolean {
  if (str === undefined || str === null) {
    return true;
  }
  return str.trim().length === 0;
}
