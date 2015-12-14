var store = (function(){
    var state = {};
    function init(){
        state = {
          isLogin: false,
          profileBox: false,
          messageBox: false
        }
    }
    function getInitState(){
        init();
        return state;
    }
    function getState(){
        //not real
    }
    function setState(data){
        //not real
    }
    return {
        setState: setState,
        getState: getState,
        getInitState: getInitState
    }
})();

export default store;