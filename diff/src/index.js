function diff(a, b, acc) {
  if (!acc) return diff(a, b, {});
  if (Object.keys(a).length == 0 && Object.keys(b) == 0) return acc;
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);

  let added = bKeys.filter(key => !aKeys.includes(key));
  let deleted = aKeys.filter(key => !bKeys.includes(key));

  let unchanged = aKeys
    .filter(key => bKeys.includes(key))
    .filter(key => a[key] !== b[key]);

  let updated = aKeys
    .filter(key => bKeys.includes(key))
    .filter(key => a[key] !== b[key])
    .filter(key => typeof a[key] !== "object");

  let appended = updated
    .filter(key => typeof a[key] === "string")
    .filter(key => b[key].startsWith(a[key]));

  updated = updated.filter(key => !appended.includes(key));

  if (!acc.added) acc.added = {};
  if (!acc.deleted) acc.deleted = {};
  if (!acc.updated) acc.updated = {};
  if (!acc.append) acc.append = {};

  unchanged
    .filter(key => typeof a[key] === "object")
    .forEach(key => {
      let d = diff(a[key], b[key]);
      Object.keys(d).forEach(modifier => (acc[modifier][key] = d[modifier]));
    });

  added.forEach(key => {
    acc.added[key] = b[key];
  });
  deleted.forEach(key => {
    acc.deleted[key] = true;
  });

  updated.forEach(key => {
    acc.updated[key] = b[key];
  });

  appended.forEach(key => {
    acc.append[key] = b[key].substring(a[key].length);
  });

  if (Object.keys(acc.added).length === 0) delete acc.added;
  if (Object.keys(acc.deleted).length === 0) delete acc.deleted;
  if (Object.keys(acc.updated).length === 0) delete acc.updated;
  if (Object.keys(acc.append).length === 0) delete acc.append;
  return acc;
}

function join(obj, diff) {
  if (diff.deleted)
    Object.keys(diff.deleted).forEach(key => {
      if (typeof diff.deleted[key] === "object")
        join(obj[key], { deleted: diff.deleted[key] });
      else delete obj[key];
    });
  if (diff.added)
    Object.keys(diff.added).forEach(key => {
      if (typeof diff.added[key] === "object") {
        if (!obj[key]) obj[key] = {};
        join(obj[key], { added: diff.added[key] });
      } else obj[key] = diff.added[key];
    });

  if (diff.updated)
    Object.keys(diff.updated).forEach(key => {
      if (typeof diff.updated[key] === "object")
        join(obj[key], { updated: diff.updated[key] });
      else obj[key] = diff.updated[key];
    });

  if (diff.append)
    Object.keys(diff.append).forEach(key => {
      if (typeof diff.append[key] === "object")
        join(obj[key], { append: diff.append[key] });
      else obj[key] += diff.append[key];
    });
  return obj;
}

module.exports = {
  diff,
  join
};
