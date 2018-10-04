/* eslint-disable no-underscore-dangle */
const printAttributes = (val, attributes, print, indent, colors, opts) =>
  attributes
    .sort()
    .map(
      (attribute) =>
        opts.spacing +
        indent(`${colors.prop.open + attribute + colors.prop.close}=`) +
        colors.value.open +
        (val.componentInstance[attribute] && val.componentInstance[attribute].constructor
          ? `{[Function ${val.componentInstance[attribute].constructor.name}]}`
          : `"${val.componentInstance[attribute]}"`) +
        colors.value.close,
    )
    .join('');

const print = (val, printFn, indent, opts, colors) => {
  let componentAttrs = '';

  const componentName = val.componentRef._elDef.element.name;
  const nodes = (val.componentRef._view.nodes || [])
    .filter((node) => node && Object.prototype.hasOwnProperty.call(node, 'renderElement'))
    .map((node) =>
      Array.from(node.renderElement.childNodes)
        .map(printFn)
        .join(''),
    )
    .join(opts.edgeSpacing);

  const attributes = Object.keys(val.componentInstance);

  if (attributes.length) {
    componentAttrs += printAttributes(val, attributes, printFn, indent, colors, opts);
  }

  return `<${componentName}${componentAttrs}${componentAttrs.length ? '\n' : ''}>\n${indent(
    nodes,
  )}\n</${componentName}>`;
};

const test = (val) =>
  val !== undefined &&
  val !== null &&
  typeof val === 'object' &&
  Object.prototype.hasOwnProperty.call(val, 'componentRef');

module.exports = {
  print,
  test,
};
