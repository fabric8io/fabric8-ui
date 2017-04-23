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
          t = `${t}${s}\n${ob.start}${formatJson(item, indent + 1)}\n${s}${ob.end}${count < obj.length ? ',' : ''}`;
        }
      } else {
        for (let p in obj) {
          if (obj.hasOwnProperty(p)) {
            if (Array.isArray(obj[p])) {
              t = `${t}\n${s}<span class='wizard-property-name' >${p}</span>${op.assign}${ar.start}${formatJson(obj[p], indent + 1)}${ar.end}`;
            } else if (typeof(obj[p]) !== 'function') {
              if (typeof(obj[p]) === 'object') {
                t = `${t}\n${s}<span class='wizard-property-name' >${p}</span>${op.assign}${formatJson(obj[p], indent + 1)}`;
              } else {
                let propertyValue = `<span class = "wizard-property-value" >${obj[p]}</span>`;
                if(propertyValue.toLowerCase().includes('exception') && !propertyValue.toLowerCase().includes('with-exception')){
                  propertyValue=`<span class = "wizard-property-value with-exception" >${obj[p]}</span>`;
                }


                t = `${t}\n${s}<span class='wizard-property-name' >${p}</span>${op.assign}${propertyValue}`;
                console.dir(propertyValue)
              }
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
