export function filterOutClosedItems(items) {
  return items.filter(item => {
    // filter out items which has state closed or done or removed
    return [
      'removed',
      'closed',
      'done'
    ].indexOf(item.attributes['system.state'].toLowerCase()) === -1;
  });
}
