/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    /**
     * 功能菜单 对应 当前的唯一别名
     * @type {{/api/sys/user/pageList: string}}
     */
    var uploadMapping = {
        "/api/sys/user/pageList": "sysUser"
    };
    /**
     * 加入全局mapping
     */
    App.requestMapping = $.extend({}, window.App.requestMapping, uploadMapping);
    /**
     * 对应requestMapping值 sysUser page函数为进入页面入口方法
     * @type {{page: App.sysUser.page}}
     */
    App.sysUser = {
        page: function (title) {
            window.App.content.empty();
            window.App.title(title);
            var content = $('<div class="panel-body" id="user_grid"></div>');
            window.App.content.append(content);
            App.sysUser.initEvents();
        }
    };
    /**
     * 初始化事件
     */
    App.sysUser.initEvents = function () {
        var grid;
        var options = {
            url: App.href + "/api/sys/user/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            contentType: "list",
            headField: "loginName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [{
                title: "id",
                field: "id",
                sort: true,
                width: "5%"
            }, {
                title: "登录名",
                field: "loginName",
                sort: true
            }, {
                title: "昵称",
                field: "displayName"
            }, {
                title: "邮箱",
                field: "email"
            }],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "25%",
            actionColumns: [{
                text: "编辑",
                cls: "btn-primary btn-sm",
                handle: function (index, data) {
                    var modal = $.orangeModal({
                        id: "userForm",
                        title: "编辑用户",
                        destroy: true
                    });
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
                        items: [{
                            type: 'hidden',
                            name: 'id',
                            id: 'id'
                        }, {
                            type: 'text',//类型
                            name: 'loginName',//name
                            id: 'loginName',//id
                            label: '登录名',//左边label
                            cls: 'input-large',
                            readonly: true,
                            rule: {
                                required: true
                            },
                            message: {
                                required: "请输入登录名"
                            }
                        }, {
                            type: 'text',//类型
                            name: 'displayName',//name
                            id: 'displayName',//id
                            label: '昵称',//左边label
                            cls: 'input-large',
                            rule: {
                                required: true
                            },
                            message: {
                                required: "请输入昵称"
                            }
                        }, {
                            type: 'text',//类型
                            name: 'contactPhone',//name
                            id: 'contactPhone',//id
                            label: '手机'
                        }, {
                            type: 'text',//类型
                            name: 'email',//name
                            id: 'email',//id
                            label: '邮箱',
                            rule: {
                                email: true
                            },
                            message: {
                                email: "请输入正确的邮箱"
                            }
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
                    var form = modal.$body.orangeForm(formOpts);
                    form.loadRemote(App.href + "/api/sys/user/load/" + data.id);
                    modal.show();
                }
            }, {
                textHandle: function (index, data) {
                    if (data.accountNonLocked) {
                        return "锁定";
                    } else {
                        return "开启";
                    }
                },
                clsHandle: function (index, data) {
                    if (data.accountNonLocked) {
                        return "btn-warning btn-sm";
                    } else {
                        return "btn-success btn-sm";
                    }
                },
                handle: function (index, data) {
                    var requestUrl = App.href + "/api/sys/user/unLock/" + data.id;
                    if (data.accountNonLocked) {
                        requestUrl = App.href + "/api/sys/user/lock/" + data.id;
                    }
                    $.ajax({
                        type: "GET",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", App.token);
                        },
                        dataType: "json",
                        url: requestUrl,
                        success: function (data) {
                            if (data.code === 200) {
                                grid.reload();
                            } else {
                                grid.alert(data.message);
                            }
                        },
                        error: function (e) {
                            alert("请求异常。");
                        }
                    });
                }
            }, {
                text: "删除",
                cls: "btn-danger btn-sm",
                handle: function (index, data) {
                    bootbox.confirm("确定该操作?", function (result) {
                        if (result) {
                            var requestUrl = App.href + "/api/sys/user/delete";
                            $.ajax({
                                type: "POST",
                                beforeSend: function (request) {
                                    request.setRequestHeader("X-Auth-Token", App.token);
                                },
                                dataType: "json",
                                data: {
                                    userId: data.id
                                },
                                url: requestUrl,
                                success: function (data) {
                                    if (data.code === 200) {
                                        grid.reload();
                                    } else {
                                        alert(data.message);
                                    }
                                },
                                error: function (e) {
                                    alert("请求异常。");
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
                            id: "userForm",
                            title: "添加用户",
                            destroy: true
                        });
                        var formOpts = {
                            id: "add_user_form",
                            name: "add_user_form",
                            method: "POST",
                            action: App.href + "/api/sys/user/insert",//表单action
                            ajaxSubmit: true,//是否使用ajax提交表单
                            rowEleNum: 1,
                            beforeSubmit: function () {
                            },
                            beforeSend: function (request) {
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
                            items: [{
                                type: 'hidden',
                                name: 'id',
                                id: 'id'
                            }, {
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
                                    minlength: 8,
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
                                type: 'text',//类型
                                name: 'displayName',//name
                                id: 'displayName',//id
                                label: '昵称',//左边label
                                cls: 'input-large',
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请输入昵称"
                                }
                            }, {
                                type: 'text',//类型
                                name: 'contactPhone',//name
                                id: 'contactPhone',//id
                                label: '手机'
                            }, {
                                type: 'text',//类型
                                name: 'email',//name
                                id: 'email',//id
                                label: '邮箱',
                                rule: {
                                    email: true
                                },
                                message: {
                                    email: "请输入正确的邮箱"
                                }
                            }, {
                                type: 'radioGroup',
                                name: 'enabled',
                                id: 'enabled',
                                label: '是否有效',
                                inline: true,
                                items: [{
                                    value: true,
                                    text: '有效'
                                }, {
                                    value: false,
                                    text: '失效'
                                }],
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请选择"
                                }
                            }, {
                                type: 'radioGroup',
                                name: 'accountNonLocked',
                                id: 'accountNonLocked',
                                label: '账号锁定状态',
                                items: [
                                    {
                                        value: true,
                                        text: '开启'
                                    }, {
                                        value: false,
                                        text: '锁定'
                                    }
                                ],
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请选择"
                                }
                            }, {
                                type: 'tree',//类型
                                name: 'roles',//name
                                id: 'roles',//id
                                label: '角色',//左边label
                                url: App.href + "/api/sys/role/treeNodes?animal_disease_token=" + App.token,
                                expandAll: true,
                                autoParam: ["id", "name", "pId"],
                                chkStyle: "checkbox",
                                detail: "如何设置角色?<a target='_blank' href='#!/api/sys/role/pageList'>点击设置</a>",
                                rule: {
                                    required: true
                                },
                                message: {
                                    required: "请选择至少一个角色"
                                }
                            }]
                        };
                        var form = modal.$body.orangeForm(formOpts);
                        modal.show();
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [{
                    type: "text",
                    label: "登录名",
                    name: "loginName",
                    placeholder: "输入要搜索的登录名"
                }, {
                    type: "text",
                    label: "昵称",
                    name: "displayName",
                    placeholder: "输入要搜索的昵称"
                }]
            }
        };
        grid = window.App.content.find("#user_grid").orangeGrid(options);
    };
})(jQuery, window, document);
