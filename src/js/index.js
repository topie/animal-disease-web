/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var token = $.cookie('animal_disease_tc_t');
    if (token == undefined) {
        window.location.href = '../login.html';
    }
    App.token = token;

    var requestMapping = {
        "/api/index": "index"
    };
    App.requestMapping = $.extend({}, App.requestMapping, requestMapping);

    App.index = {
        page: function (title) {
            App.content.empty();
            App.title(title);
            var content = $(
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<i class="fa fa-bar-chart-o fa-fw"></i>通知公告' +
                '</div>' +
                '<div class="panel-body" id="news_grid"></div>' +
                '</div>'+
                '</div>'
            );

            App.content.append(content);
            initEvents();
        }
    };
    /**
     * 初始化事件
     */
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/news/indexList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "newId",//id域指定
            headField: "newTitle",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "标题",
                    field: "newTitle",
                    format: function (i, data) {
                        return '<a href="javascript:App.index.viewNews(\'' + data.newId + '\',\'' + data.newTitle + '\')">' + data.newTitle + '</a>';
                    }
                }, {
                    title: '发布时间',
                    field: 'newDate'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%"
        };
        grid = window.App.content.find("#news_grid").orangeGrid(options)
    };

    App.index.viewNews = function (newId, newTitle) {
        var modal = $.orangeModal({
            id: "news_edit_modal",
            title: newTitle,
            width: 900,
            height: 500,
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    text: '关闭',
                    cls: "btn-default",
                    handle: function () {
                        modal.hide()
                    }
                }
            ]
        }).show()
        var formOpts = {
            id: "news_form",
            name: "news_form",
            method: "POST",
            labelInline: false,
            action: App.href + "",
            ajaxSubmit: true,//是否使用ajax提交表单
            submitText: "保存",//保存按钮的文本
            showReset: false,//是否显示重置按钮
            showSubmit: false,
            resetText: "重置",//重置按钮文本
            isValidate: true,//开启验证
            buttonsAlign: "center",
            items: [
                {
                    type: 'hidden',
                    name: 'newDate',
                    id: 'newDate'

                }, {
                    type: 'display',
                    name: 'newTitle',
                    id: 'newTitle',
                    style: 'text-align: center;',
                    label: '',
                    format: function (val) {
                        return '<h1>' + val + '</h1>'
                    }
                },
                {
                    type: 'display',
                    name: 'newCount',
                    id: 'newCount',
                    style: 'text-align: right;',
                    label: '',
                    format: function (val) {
                        return '<h4>' +
                            '创建时间: <span id="createTime">' + $("#newDate").val() + '</span> &nbsp;' +
                            '阅读次数: <span id="lookAmount">' + val + '</span> ' +
                            '</h4><hr>'
                    }
                },
                {
                    type: 'display',
                    name: 'newBody',
                    id: 'newBody',
                    label: ''
                }
            ]
        };
        var form = modal.$body.orangeForm(formOpts)
        form.loadRemote(App.href + "/api/animal/news/view/" + newId)
    }

    App.index.editProfile = function () {
        var modal = $.orangeModal({
            id: "user_info_edit_modal",
            title: "编辑",
            destroy: true
        })
        var formOpts = {
            id: "user_info_form",//表单id
            name: "user_info_form",//表单名
            method: "POST",//表单method
            action: App.href + "/api/animal/userInfo/updateCurrent",//表单action
            ajaxSubmit: true,//是否使用ajax提交表单
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token)
            },
            ajaxSuccess: function () {
                modal.hide()
            },
            submitText: "修改",//保存按钮的文本
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
                    type: 'display',
                    name: 'loginName',
                    id: 'loginName',
                    label: '登录名'
                }, {
                    type: 'password',
                    name: 'password',
                    id: 'password',
                    label: '密码',
                    cls: 'input-medium',
                    rule: {
                        minlength: 4,
                        maxlength: 64
                    },
                    message: {
                        minlength: "至少{0}位",
                        maxlength: "做多{0}位"
                    }
                }, {
                    type: 'password',
                    name: 'password2',
                    id: 'password2',
                    label: '确认密码',
                    cls: 'input-medium',
                    rule: {
                        equalTo: "#password"
                    },
                    message: {
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
                    type: 'select',
                    name: 'gender',
                    id: 'gender',
                    label: '性别',
                    items: [
                        {
                            text: "请选择",
                            value: ""
                        },
                        {
                            text: "男",
                            value: "男"
                        }, {
                            text: "女",
                            value: "女"
                        }
                    ]
                }, {
                    type: 'text',
                    name: 'phone',
                    id: 'phone',
                    label: '电话'
                }, {
                    type: 'text',
                    name: 'fax',
                    id: 'fax',
                    label: '传真'
                }, {
                    type: 'text',
                    name: 'mobile',
                    id: 'mobile',
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
                }
            ]
        };
        var form = modal.$body.orangeForm(formOpts)
        form.loadRemote(App.href + "/api/animal/userInfo/loadCurrent/")
        modal.show()
    }

})(jQuery, window, document);
