export function formatJson(obj: any, indent: number = 0): string {
  let t = '';
  let s: string = '   ';
  let ar = {
    start: ' [ ',
    end: ' ] '
  };
  let ob = {
    start: ' { ',
    end: ' } '
  };

  s = s.repeat(indent);

  if (Array.isArray(obj)) {
    let count = 0;
    for (let item of obj) {
      count++;
      t = `${t}${s}\n${s}${ob.start}${formatJson(item, indent + 1)}\n${s}${ob.end}${count < obj.length ? ',' : ''}`;
    }
  } else {
    for (let p of Object.getOwnPropertyNames(obj)) {
      let tmp = obj[p];
      if (Array.isArray(tmp)) {
        t = `${t}\n${s}<span class="property-name" >${p}</span>${ar.start}${formatJson(tmp, indent + 1)}${ar.end}`;
      } else if (typeof (tmp) !== 'function') {
        if (typeof (tmp) === 'object') {
          t = `${t}\n${s}<span class="property-name" >${p}</span>${formatJson(tmp, indent + 1)}`;
        } else {
          let propertyValue = `<span class="property-value" >${tmp}</span>`;
          if (propertyValue.toLowerCase().includes('exception') && !propertyValue.toLowerCase().includes('property-value-error')) {
            propertyValue = `<span class="property-value property-value-error" >${obj[p]}</span>`;
          }
          t = `${t}\n${s}<span class="property-name" >${p}</span>${propertyValue}`;
        }
      }
    }
  }
  return `${t}`;
}

export function clone<T>(value: any): T {
  return <T> JSON.parse(JSON.stringify(value || {}));
}


export function getPropertyValue<T>(obj1: T, dataToRetrieve: string) {
  return dataToRetrieve
    .split('.') // split string based on `.`
    .reduce(function(o, k) {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj1); // set initial value as object
}

export function mergeArraysDistinctByKey<T>(destination: T[], origin: T[], key: string) {
  for (let itemToAddOrReplace of origin) {
    let requestFieldIndex = destination.findIndex((f) => getPropertyValue(f, key) === getPropertyValue(itemToAddOrReplace, key));
    if (requestFieldIndex != -1) {
      // if already there replace it
      destination[requestFieldIndex] = itemToAddOrReplace;
    } else {
      // if not already there add it
      destination.push(itemToAddOrReplace);
    }
  }
}
