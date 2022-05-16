export const byString = (o: any, s: any) => {
  if (!s) {
    return;
  }

  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var x = a[i];
    if (o && x in o) {
      o = o[x];
    } else {
      return;
    }
  }
  return o;
};

export const setByString = (obj: any, path: any, value: any) => {
  var schema = obj; // a moving reference to internal objects within obj

  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  var pList = path.split(".");
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
};
