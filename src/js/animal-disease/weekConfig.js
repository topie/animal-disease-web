/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/weekConfig/pageList": "weekConfig"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.weekConfig = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="week_config_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/weekConfig/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "templateId",//id域指定
            headField: "templateName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            showContentType: false,
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "年份",
                    field: "year"
                }, {
                    title: "类别",
                    field: "type",
                    format: function (i, d) {
                        return d.type == 0 ? '春防' : '秋防';
                    }
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
                            id: "week_config_edit_modal",
                            title: "编辑",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "week_config_form",
                            name: "week_config_form",
                            method: "POST",
                            action: App.href + "/api/animal/weekConfig/update",
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
                                    name: 'id',
                                    id: 'id'
                                }, {
                                    type: 'text',
                                    name: 'year',
                                    id: 'year',
                                    label: '年份',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入年份"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '类型',
                                    cls: 'input-large',
                                    items: [
                                        {
                                            text: "请选择",
                                            value: ""
                                        }, {
                                            text: "春防",
                                            value: 0
                                        }, {
                                            text: "秋防",
                                            value: 1
                                        }
                                    ],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择类型"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'part1',
                                    id: 'part1',
                                    label: '配置1',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入配置1"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'part2',
                                    id: 'part2',
                                    label: '配置2',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入配置2"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/weekConfig/load/" + data.id)
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/weekConfig/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.id
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
                }
            ],
            tools: [
                {
                    text: " 添 加",//按钮文本
                    cls: "btn btn-primary",//按钮样式
                    icon: "fa fa-cubes",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "week_config_add_modal",
                            title: "添加",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "add_org_form",
                            name: "add_org_form",
                            method: "POST",
                            action: App.href + "/api/animal/weekConfig/insert",
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
                                    name: 'year',
                                    id: 'year',
                                    label: '年份',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入年份"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '类型',
                                    cls: 'input-large',
                                    items: [
                                        {
                                            text: "请选择",
                                            value: ""
                                        }, {
                                            text: "春防",
                                            value: 0
                                        }, {
                                            text: "秋防",
                                            value: 1
                                        }
                                    ],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择类型"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'part1',
                                    id: 'part1',
                                    label: '配置1',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入配置1"
                                    }
                                }, {
                                    type: 'textarea',
                                    name: 'part2',
                                    id: 'part2',
                                    label: '配置2',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入配置2"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                    }
                }
            ]
        }
        grid = window.App.content.find("#week_config_grid").orangeGrid(options)
    }
})(jQuery, window, document)
