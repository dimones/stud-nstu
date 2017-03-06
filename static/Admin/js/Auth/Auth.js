/**
 * Created by Aleksandr on 26.02.17.
 */
function StudNSTUOnLoad(){
    Cookies.set('isAuthed',false);
    if(Cookies.get('device_id') == null || Cookies.get('device_id') == undefined)
        Cookies.set('device_id',guid());
    else {
        // window.location.href = "/admin/news/list";
    }

}

function submitLogin(form){
    var device_id = Cookies.get('device_id');
    var jqxhr = $.post("/api/admin/auth", {  "username" : $("#logUsername").val(),
                                                        "password" : $("#logPassword").val(),
                                                        "device_id": device_id })
      .done(function(data) {
//        alert(data);
        var ret = JSON.parse(data);
        if(ret["succeed"] == true)
        {
            $("#loadText").css('display','none');
            Cookies.set('device_token',ret["device_token"]);
            Cookies.set('isAuthed',true);
            window.location.href = "/admin/news/list";
        }
        else{
            console.log('#loginAlert','alert-warning','Ошибка','Неверная связка логин/пароль!');
        }
//        alert( "second success" );
      })
      .fail(function(data) {
          console.log(data);
      });
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}