/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var location = window.location.href;
    if (location.lastIndexOf("?") > 0) {
        var params = location.substring(location.lastIndexOf("?") + 1);
        var ticket = getParamsString(params, "AUTH_TICKET");
        var type = getParamsString(params, "TYPE");
        var id = getParamsString(params, "ID");
        autoLogin(ticket, id);
    } else {
        alert("参数未定义");
    }
    function getParamsString(params, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = params.match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }


    function autoLogin(ticket, id) {
        $.ajax(
            {
                type: 'POST',
                url: App.href + "/api/token/oss",
                dataType: "json",
                data: {
                    ticket: ticket
                },
                success: function (result) {
                    if (result.code === 200) {
                        $.cookie('animal_disease_tc_t', result.token, {expires: 7});
                        var formOpts = {
                            id: "index_form",//表单id
                            name: "index_form",//表单名
                            method: "POST",//表单method
                            action: App.href + "/api/sys/user/update",//表单action
                            ajaxSubmit: true,//是否使用ajax提交表单
                            beforeSubmit: function () {
                            },
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token);
                            },
                            ajaxSuccess: function () {
                                modal.hide();
                                grid.reload();
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide();
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                }, {
                                    type: 'tree',//类型
                                    name: 'roles',//name
                                    id: 'roles',//id
                                    label: '角色',//左边label
                                    url: App.href + "/api/sys/role/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "checkbox",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择至少一个角色"
                                    }
                                }]
                        };
                        var form = $("#main-body").orangeForm(formOpts);
                        form.loadRemote(App.href + "/api/sys/user/loadUser/" + id);
                    }
                }
            });
    }

})(jQuery, window, document);
