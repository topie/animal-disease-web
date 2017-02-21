/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/userInfo/pageList": "userInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.userInfo = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="user_info_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/userInfo/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "realName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "登录名",
                    field: "loginName"
                }, {
                    title: "真实姓名",
                    field: "realName"
                }, {
                    title: "性别",
                    field: "gender"
                }, {
                    field: 'jobTitle',
                    title: '职称'
                }, {
                    field: 'leaderName',
                    title: '主管领导'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "user_info_edit_modal",
                            title: "编辑",
                            destroy: true
                        })
                        var formOpts = {
                            id: "user_info_form",//表单id
                            name: "user_info_form",//表单名
                            method: "POST",//表单method
                            action: App.href + "/api/animal/userInfo/update",//表单action
                            ajaxSubmit: true,//是否使用ajax提交表单
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            ajaxSuccess: function () {
                                modal.hide()
                                grid.reload()
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide()
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'hidden',
                                    name: 'userId',
                                    id: 'userId'
                                }, {
                                    type: 'hidden',
                                    name: 'platformId',
                                    id: 'platformId'
                                }, {
                                    type: 'text',
                                    name: 'realName',
                                    id: 'realName',
                                    label: '真实姓名',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入真实姓名"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'gender',
                                    id: 'gender',
                                    label: '性别',
                                    rule: {
                                        maxlength: 1
                                    },
                                    message: {
                                        maxlength: "做多{0}位"
                                    }
                                }, {
                                    type: 'text',//类型
                                    name: 'phone',//name
                                    id: 'phone',//id
                                    label: '电话'
                                }, {
                                    type: 'text',//类型
                                    name: 'fax',//name
                                    id: 'fax',//id
                                    label: '传真'
                                }, {
                                    type: 'text',//类型
                                    name: 'mobile',//name
                                    id: 'mobile',//id
                                    label: '手机'
                                }, {
                                    type: 'text',
                                    name: 'jobTitle',
                                    id: 'jobTitle',
                                    label: '职称',
                                    cls: 'input-large'
                                }, {
                                    type: 'text',
                                    name: 'leaderName',
                                    id: 'leaderName',
                                    label: '主管领导',
                                    cls: 'input-large'
                                }, {
                                    type: 'tree',//类型
                                    name: 'orgId',
                                    id: 'orgId',//id
                                    label: '组织机构',//左边label
                                    url: App.href + "/api/animal/orgInfo/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个机构"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/userInfo/load/" + data.userId)
                        modal.show()
                    }
                }, {
                    text: "绑定",
                    cls: "btn-warning btn-sm",
                    visible: function (index, data) {
                        return data.platformId <= 0;
                    },
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/userInfo/bind/"+data.userId;
                                $.ajax({
                                    type: "GET",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    url: requestUrl,
                                    success: function (data) {
                                        if (data.code === 200) {
                                            grid.reload()
                                        } else {
                                            alert(data.message)
                                        }
                                    },
                                    error: function (e) {
                                        alert("请求异常。")
                                    }
                                });
                            }
                        });
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/userInfo/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.userId
                                    },
                                    url: requestUrl,
                                    success: function (data) {
                                        if (data.code === 200) {
                                            grid.reload()
                                        } else {
                                            alert(data.message)
                                        }
                                    },
                                    error: function (e) {
                                        alert("请求异常。")
                                    }
                                });
                            }
                        });
                    }
                }],
            tools: [
                {
                    text: " 添 加",//按钮文本
                    cls: "btn btn-primary",//按钮样式
                    icon: "fa fa-cubes",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "user_info_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_user_form",
                            name: "add_user_form",
                            method: "POST",
                            action: App.href + "/api/animal/userInfo/insert",//表单action
                            ajaxSubmit: true,//是否使用ajax提交表单
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                                modal.hide()
                                grid.reload()
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: true,//是否显示重置按钮
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttons: [{
                                type: 'button',
                                text: '关闭',
                                handle: function () {
                                    modal.hide()
                                }
                            }],
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'text',//类型
                                    name: 'loginName',//name
                                    id: 'loginName',//id
                                    label: '登录名',//左边label
                                    cls: 'input-large',
                                    rule: {
                                        required: true,
                                        remote: {
                                            type: "post",
                                            url: App.href + "/api/noneAuth/unique",
                                            data: {
                                                loginName: function () {
                                                    return $("#loginName").val();
                                                }
                                            },
                                            dataType: "json",
                                            dataFilter: function (data, type) {
                                                return data;
                                            }
                                        }
                                    },
                                    message: {//对应验证提示信息
                                        required: "请输入登录名",
                                        remote: "登录名被占用"
                                    }
                                }, {
                                    type: 'password',//类型
                                    name: 'password',//name
                                    id: 'password',//id
                                    label: '密码',//左边label
                                    cls: 'input-medium',
                                    rule: {
                                        required: true,
                                        minlength: 4,
                                        maxlength: 64
                                    },
                                    message: {
                                        required: "请输入密码",
                                        minlength: "至少{0}位",
                                        maxlength: "做多{0}位"
                                    }
                                }, {
                                    type: 'password',//类型
                                    name: 'password2',//name
                                    id: 'password2',//id
                                    label: '确认密码',//左边label
                                    cls: 'input-medium',
                                    rule: {
                                        required: true,
                                        equalTo: "#password"
                                    },
                                    message: {
                                        required: "请输入确认密码密码",
                                        equalTo: "与密码不一致"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'realName',
                                    id: 'realName',
                                    label: '真实姓名',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入真实姓名"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'gender',
                                    id: 'gender',
                                    label: '性别',
                                    rule: {
                                        maxlength: 1
                                    },
                                    message: {
                                        maxlength: "做多{0}位"
                                    }
                                }, {
                                    type: 'text',//类型
                                    name: 'phone',//name
                                    id: 'phone',//id
                                    label: '电话'
                                }, {
                                    type: 'text',//类型
                                    name: 'fax',//name
                                    id: 'fax',//id
                                    label: '传真'
                                }, {
                                    type: 'text',//类型
                                    name: 'mobile',//name
                                    id: 'mobile',//id
                                    label: '手机'
                                }, {
                                    type: 'text',
                                    name: 'jobTitle',
                                    id: 'jobTitle',
                                    label: '职称',
                                    cls: 'input-large'
                                }, {
                                    type: 'text',
                                    name: 'leaderName',
                                    id: 'leaderName',
                                    label: '主管领导',
                                    cls: 'input-large'
                                }, {
                                    type: 'tree',//类型
                                    name: 'orgId',
                                    id: 'orgId',//id
                                    label: '组织机构',//左边label
                                    url: App.href + "/api/animal/orgInfo/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个机构"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        modal.show()
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                items: [
                    {
                        type: "text",
                        label: "登录名",
                        name: "loginName",
                        placeholder: "输入要搜索的登录名"
                    }, {
                        type: "text",
                        label: "真实姓名",
                        name: "realName",
                        placeholder: "输入要搜索的真实姓名"
                    }
                ]
            }
        };
        grid = window.App.content.find("#user_info_grid").orangeGrid(options)
    };
})(jQuery, window, document)