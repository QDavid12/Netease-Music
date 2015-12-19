var store = (function(){
    var state = {};
    function init(){
        var newstate = {
          profileBox: false,
          messageBox: false,
          userSonglist: [],
          playList: [],
          num: 0,
          radioList: [],
          radioNum: 0,
          mode: "playList",
          play: false,
          radio: false,
          song: false,
          lyric: undefined,
          comments: undefined
        }
        for(var x in newstate){
            state[x] = newstate[x];
        }
    }
    function getInitState(){
        init();
        return state;
    }
    function getState(){
        return state;
    }
    function setState(data){
        //not real
    }
    function setStore(data){
        console.log("store");
        console.log(data);
        for(var x in data){
            state[x] = data[x];
        }
    }
    return {
        setStore: setStore,
        setState: setState,
        getState: getState,
        getInitState: getInitState
    }
})();

export default store;