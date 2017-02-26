/**
 * Created by Aleksandr on 26.02.17.
 */
function submitLogin(form){
    var device_id = Cookies.get('device_id');
    var jqxhr = $.post("Admin/auth", {  "username" : $("#logUsername").val(),
                                                        "password" : $("#logPassword").val(),
                                                        "device_id": device_id })
      .done(function(data) {
//        alert(data);
        var ret = JSON.parse(data);
        if(ret["succeed"] == true)
        {
            $("#loadText").css('display','none');
            setIndicator('#loginAlert','alert-success','Успех','Вы успешно авторизовались!');
            Cookies.set('device_token',ret["device_token"]);
            Cookies.set('user_info',ret.user_info);
            Cookies.set('isAuthed',true);
            set_user_info();
        }
        else{
            setIndicator('#loginAlert','alert-warning','Ошибка','Неверная связка логин/пароль!');
        }
//        alert( "second success" );
      })
      .fail(function(data) {
          console.log(data);
            setIndicator('#loginAlert','alert-danger','Ошибка','Неполадки в соединении с сервером!');
      });
}