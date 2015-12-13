'use strict';

module.exports = home;

var USER_HOME = process.platform == 'win32'
  ? process.env.HOMEPATH || process.env.USERPROFILE
  : process.env.HOME;

var node_path = require('path');

function home () {
  return USER_HOME;
}


var resolve = node_path.resolve;

// The enhanced `path.resolve`
home.resolve = function (/* [from,] */ to) {
  switch(arguments.length){
    case 0:
      return resolve();
    case 1:
      return resolve(resolve_home(to));
    case 2:
      return resolve(resolve_home(to), resolve_home(arguments[1]));
    default:
      // Actually, `node_path.resolve` has no `this` pointer,
      // however, we apply it to `node_path` 
      return resolve.apply(node_path, map_resolve(arguments));
  }
};


function resolve_home (path) {
  if (!path) {
    // Actually, it will lead to an TypeError of `path.resolve`
    return path;
  }

  if (path === '~') {
    return USER_HOME;
  }

  // I thought, nobody will use `'~\\path\\to'`, but only `'~/path/to'`
  if (!~path.indexOf('~/')) {
    // '~file'
    return path;
  }

  // '~/file' -> '/Users/xxx/file'
  return USER_HOME + path.slice(1);
}


function map_resolve (args) {
  var paths = [];
  var length = args.length;
  while(length --){
    paths[length] = resolve_home(args[length]);
  }

  return paths;
}
