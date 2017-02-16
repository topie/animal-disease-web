/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    function initLogin() {
        $('#username,#password').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                login();
            }
        });
        $("#login_btn").on("click", login);
    }

    var login = function () {
        if ($("#username").val() === "" || $("#username").val() == "password") {
            alert("登录名或密码不能为空!")
        }
        var fields = JSON.stringify(
            {
                "username": $("#username").val(),
                "password": $("#password").val()
            });
        $.ajax({
            type: 'POST',
            url: App.href + "/api/token/generate",
            contentType: "application/json",
            dataType: "json",
            data: fields,
            success: function (result) {
                if (result.code == 200) {
                    $.cookie('animal_disease_tc_t', result.token, {expires: 7});
                    window.location.href = App.href;
                } else {
                    alert(result.message);
                }
            },
            error: function (err) {

            }
        });
    };
    $(document).ready(function () {
        initLogin();
    });
})(jQuery, window, document);
