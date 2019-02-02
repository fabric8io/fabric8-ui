/**
 * Joins the paths so that there is always a single '/' character between the paths
 * @param paths an array of paths
 * @return {string} the paths combined together
 */
export function pathJoin(...paths: string[]): string {
  const tmp = [];
  const length = paths.length - 1;
  paths.forEach((path, index) => {
    let p = path;
    if (isBlank(p)) {
      return;
    }
    if (p === '/') {
      tmp.push('');
      return;
    }
    if (index !== 0 && p.match(/^\//)) {
      p = p.slice(1);
    }
    if (index !== length && p.match(/\/$/)) {
      p = p.slice(0, p.length - 1);
    }
    if (!isBlank(p)) {
      tmp.push(p);
    }
  });
  const rc = tmp.join('/');
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
