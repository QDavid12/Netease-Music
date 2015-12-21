'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

const api = require('./js/api/api');
const Crypto = require('./js/api/Crypto');
var ipc = require('electron').ipcMain;

// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600, 
    height: 800,
    minWidth: 1060,
    minHeight: 680,
    resizable: true,
    frame: false,
    transparent: true,
    icon: 'file://' + __dirname + '/img/wangyiyun.jpg'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname +'/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  /* ipc part */
  ipc.on('encode', function(event, username, password){
    var ret = event;
    api.encode(username, password, function(res){
      ret.returnValue = res;
    })
  });

  ipc.on('encrypt', function(event, data){
    var body = Crypto.aesRsaEncrypt(JSON.stringify(data));
    event.returnValue = body;
  });

  ipc.on('close', function(event){
    console.log("close");
    app.quit();
  });

  ipc.on('maximize', function(event){
    if(mainWindow.isMaximized()){
      mainWindow.restore();
    }
    else{
      mainWindow.maximize();
    }
    //mainWindow.maximize();
    event.returnValue = "maximize";
  });

  ipc.on('minimize', function(event){
    mainWindow.minimize();
    event.returnValue = "minimize";
  });

  ipc.on('getUrl', function(event, id){
    event.returnValue = "http://m2.music.126.net/"+encode(id)+"/"+id+".mp3";
  })
  ipc.on('getImgUrl', function(event, id){
    event.returnValue = "http://p3.music.126.net/"+encode(id)+"/"+id+".jpg";
  })

  function encode(id){
    var magic = bytearray('3go8&$8*3*3h0k(2)2');
    var song_id = bytearray(id.toString());
    var len = magic.length;
    for(var i=0;i<song_id.length;i++){
        song_id[i] = song_id[i] ^ magic[i % len]
    }
    //YVc3rbICo1Blq8RMGjHLvA==
    song_id = bytestring(song_id);
    return Crypto.MD564(song_id).replace(/\//g, "_").replace(/\+/g, "-");
  }
  function bytearray(str){
      var res = [];
      for(var i=0;i<str.length;i++){
          res.push(str.substr(i,1).charCodeAt());
      }
      return res;
  }
  function bytestring(array){
      var res = "";
      for(var x in array){
          res += String.fromCharCode(array[x]);
      }
      return res;
  }
});
