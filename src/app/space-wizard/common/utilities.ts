    // remove leading spaces from lines
    // message=(message||'').replace(/^\s*/gm, '')
    // replace lines containing only  digits and spaces with a new line
    // message=(message||'').replace(/[\n][\d]+[\s]*[\d]*[\s]*[\n]/gi,'\n')
    // replace status success with new line
    // collapse new lines
    // message=(message||'').replace(/[\n]+/gi,'\n',)
    // remove duplicate lines
    // var re = /^(.*)(\r?\n\1)+$/gm;
    // message=message.replace(re, "$1");

  export function formatJson(obj: any, indent: number= 0): string {
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
    let op = {assign: ` = `};

    s = s.repeat(indent);
    {
      if ( Array.isArray(obj)) {
        let count = 0;
        for ( let item of obj) {
          count++;
          t = `${t}${s}\n${s}${ob.start}${formatJson(item, indent + 1)}\n${s}${ob.end}${count < obj.length ? ',' : ''}`;
        }
      } else {
        for (let p of Object.getOwnPropertyNames(obj)) {
          let tmp = obj[p];
          if (Array.isArray(tmp)) {
            t = `${t}\n${s}<span class="property-name" >${p}</span>${op.assign}${ar.start}${formatJson(tmp, indent + 1)}${ar.end}`;
          } else if (typeof(tmp) !== 'function') {
            if (typeof(tmp) === 'object') {
              t = `${t}\n${s}<span class="property-name" >${p}</span>${op.assign}${formatJson(tmp, indent + 1)}`;
            } else {
              let propertyValue = `<span class="property-value" >${tmp}</span>`;
              if (propertyValue.toLowerCase().includes('exception') && !propertyValue.toLowerCase().includes('property-value-error')) {
                propertyValue = `<span class="property-value property-value-error" >${obj[p]}</span>`;
              }
              t = `${t}\n${s}<span class="property-name" >${p}</span>${op.assign}${propertyValue}`;
            }
          }
        }
      }
    }
    return `${t}`;
  }

  export function clone<T>(value: any): T {
    return  <T>JSON.parse(JSON.stringify( value || {} ));
  }
