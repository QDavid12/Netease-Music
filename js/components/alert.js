var alert = (function(){
    var body = document.body;
    var alert = function(text, time){
        var div = document.createElement("div");
        div.innerHTML = '<i class="glyphicon glyphicon-info-sign"></i>'+text;
        var time = time||1000;
        div.className = "alert";
        body.appendChild(div);
        window.setTimeout(function(){
            div.style.opacity = 0;
        }, time);
        window.setTimeout(function(){
            body.removeChild(div);
        }, time+300);
    }
    return{
        alert: alert
    }
})(document, window);

export default alert;