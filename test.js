/**
 * Created by chenguojun on 2017/3/30.
 */
var re = /^[0-9]+(.[0-9]{1,2})?$/
var location = "http://animal.topie.com/login.html?AUTH_TICKET=1C6C4CFFE3170CBB20C25765A3DAFBE5";
if (location.lastIndexOf("?") > 0) {
    var params = location.substring(location.lastIndexOf("?") + 1);
    console.info(getParamsString(params, "AUTH_TICKET"));

}

function getParamsString(params, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = params.match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}