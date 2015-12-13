'use strict';

var expect = require('chai').expect;
var home = require('../');


// Node.js test cases from https://github.com/joyent/node/blob/master/test/simple/test-path.js
var isWindows = process.platform === 'win32';
if (isWindows) {
  // windows
  var resolveTests =
    // arguments                                    result
    [
      [
        ['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'
      ],
      [
        ['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'
      ],
      [
        ['c:/ignore', 'c:/some/file'], 'c:\\some\\file'
      ],
      [
        ['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'
      ],
      [
        ['.'], process.cwd()
      ],
      [
        ['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'
      ],
      [
        ['c:/', '//'], 'c:\\'
      ],
      [
        ['c:/', '//dir'], 'c:\\dir'
      ],
      [
        ['c:/', '//server/share'], '\\\\server\\share\\'
      ],
      [
        ['c:/', '//server//share'], '\\\\server\\share\\'
      ],
      [
        ['c:/', '///some//dir'], 'c:\\some\\dir'
      ]
    ];
} else {
  // Posix
  var resolveTests =
    // arguments                                    result
    [
      [
        ['/var/lib', '../', 'file/'], '/var/file'
      ],
      [
        ['/var/lib', '/../', 'file/'], '/file'
      ],
      [
        ['a/b/c/', '../../..'], process.cwd()
      ],
      [
        ['.'], process.cwd()
      ],
      [
        ['/some/dir', '.', '/absolute/'], '/absolute'
      ]
    ];
}

// var home = require('path')
var resolve = home.resolve;
describe("home.resolve(), with no '~' path:", function(){
  resolveTests.forEach(function (c) {
    var args = c[0];
    var result = c[1];
    it(
      'normal: ' + args.map(JSON.stringify).join(', ') 
      + ' -> ' + JSON.stringify(result), function(){
      expect(resolve.apply(home, args)).to.equal(result);
    });
  });
});


if (isWindows) {
  var HOME = process.env.USERPROFILE;

  // windows
  var homeResolveTests =
    // arguments                                    result
    [
      [
        ['~'], HOME
      ],
      [
        ['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'
      ],
      [
        ['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'
      ],
      [
        ['c:/ignore', 'c:/some/file'], 'c:\\some\\file'
      ],
      [
        ['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'
      ],
      [
        ['.'], process.cwd()
      ],
      [
        ['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'
      ],
      [
        ['c:/', '//'], 'c:\\'
      ],
      [
        ['c:/', '//dir'], 'c:\\dir'
      ],
      [
        ['c:/', '//server/share'], '\\\\server\\share\\'
      ],
      [
        ['c:/', '//server//share'], '\\\\server\\share\\'
      ],
      [
        ['c:/', '///some//dir'], 'c:\\some\\dir'
      ]
    ];

} else {
  var HOME = process.env.HOME;
  // Posix
  var homeResolveTests =
    // arguments                                    result
    [
      [
        ['~'], HOME
      ],
      [
        ['~/var/lib', '../', 'file/'], HOME + '/var/file'
      ],
      [
        ['~/var/lib', '/../', 'file/'], '/file'
      ],
      [
        ['~/some/dir', '.', '~/absolute/'], HOME + '/absolute'
      ],
      [
        ['~/some/dir', '.', '/absolute/'], '/absolute'
      ]
    ];
}


describe("home():", function(){
  it("home(), should return home dir", function(){
    expect(home()).to.equal(HOME);
  });
});


describe("home.resolve(), with '~' path:", function(){
  homeResolveTests.forEach(function (c, i) { console.log(c, i)
    var args = c[0];
    var result = c[1];
    it(args.map(JSON.stringify).join(', ') + ' -> ' + JSON.stringify(result), function(){
      expect(resolve.apply(home, args)).to.equal(result);
    });
  });
});
