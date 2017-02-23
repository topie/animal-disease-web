/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/news/pageList": "news"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.news = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="news_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/news/pageList",
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
                    field: "newTitle"
                }, {
                    title: '发布时间',
                    field: 'newDate'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "查看",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "news_edit_modal",
                            title: "查看",
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
                            action: App.href + "/api/animal/news/update",
                            ajaxSubmit: true,//是否使用ajax提交表单
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            ajaxSuccess: function () {
                                modal.hide()
                                grid.reload()
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: false,//是否显示重置按钮
                            showSubmit: false,
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'display',
                                    name: 'newTitle',
                                    id: 'newTitle',
                                    style: 'text-align: center;',
                                    label: '',
                                    format: function (i, d) {
                                        return '<h1>' + data.newTitle + '</h1>'
                                    }
                                },
                                {
                                    type: 'display',
                                    name: 'newDate',
                                    id: 'newDate',
                                    style: 'text-align: right;',
                                    label: '',
                                    format: function (i, d) {
                                        return '<h4>' +
                                            '创建时间: <span id="createTime">' + data.newDate + '</span> &nbsp;' +
                                            '阅读次数: <span id="lookAmount">' + data.newCount + '</span> ' +
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
                        form.loadRemote(App.href + "/api/animal/news/load/" + data.newId)
                    }
                }, {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "news_edit_modal",
                            title: "编辑",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "news_form",
                            name: "news_form",
                            method: "POST",
                            action: App.href + "/api/animal/news/update",
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
                                    name: 'newId',
                                    id: 'newId'
                                }, {
                                    type: 'text',
                                    name: 'newTitle',
                                    id: 'newTitle',
                                    label: '机构名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入标题"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'newDate',
                                    id: 'newDate',
                                    label: '发布时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择日期"
                                    }
                                }, {
                                    type: 'kindEditor',
                                    name: 'newBody',
                                    id: 'newBody',
                                    label: '新闻内容',
                                    height: "300px",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "新闻内容"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/news/load/" + data.newId)
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/news/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.newId
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
                            id: "news_add_modal",
                            title: "添加",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "add_org_form",
                            name: "add_org_form",
                            method: "POST",
                            action: App.href + "/api/animal/news/insert",
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
                                    type: 'text',
                                    name: 'newTitle',
                                    id: 'newTitle',
                                    label: '机构名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入标题"
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'newDate',
                                    id: 'newDate',
                                    label: '发布时间',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择日期"
                                    }
                                }, {
                                    type: 'kindEditor',
                                    name: 'newBody',
                                    id: 'newBody',
                                    label: '新闻内容',
                                    height: "300px",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "新闻内容"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [{
                    type: "text",
                    label: "标题",
                    name: "newTitle",
                    placeholder: "搜索标题"
                }]
            }
        };
        grid = window.App.content.find("#news_grid").orangeGrid(options)
    };
})(jQuery, window, document)
