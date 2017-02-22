/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/template/pageList": "templateInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.templateInfo = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="template_info_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/template/pageList",
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
                    title: "模板名称",
                    field: "templateName"
                }, {
                    title: '填报类型',
                    field: 'reportType',
                    format: function (i, data) {
                        switch (data.reportType) {
                            case 3:
                                return '月度免疫'
                                break
                            case 2:
                                return '春秋防周报'
                                break
                            case 7:
                                return '春秋防数据汇总'
                                break
                            case 4:
                                return '物资储备'
                                break
                            default:
                                return '-'
                                break
                        }
                    }
                }, {
                    title: '填报周期',
                    field: 'reportCycle',
                    format: function (i, data) {
                        switch (data.reportCycle) {
                            case 7:
                                return '当月疫苗订购与使用管理'
                                break
                            case 3:
                                return '应急物资储备管理'
                                break
                            case 4:
                                return '春防/秋防管理'
                                break
                            case 12:
                                return '春秋防总结'
                                break
                            case 2:
                                return '防控应急管理'
                                break
                            default:
                                return '-'
                                break
                        }
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
                            id: "template_info_edit_modal",
                            title: "编辑",
                            destroy: true
                        })
                        var formOpts = {
                            id: "template_info_form",//表单id
                            name: "template_info_form",//表单名
                            method: "POST",//表单method
                            action: App.href + "/api/animal/template/update",//表单action
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
                                    name: 'templateId',
                                    id: 'templateId'
                                }, {
                                    type: 'text',
                                    name: 'templateName',
                                    id: 'templateName',
                                    label: '模板名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入模板名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'tableName',
                                    id: 'tableName',
                                    label: '数据库表名',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入数据库表名"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'normalTemplate',
                                    id: 'normalTemplate',
                                    label: '填报模板名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入填报模板名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'summaryTemplate',
                                    id: 'summaryTemplate',
                                    label: '汇总模板名称',
                                    cls: 'input-large'
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportType',
                                    id: 'reportType',
                                    label: '填报类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: 3,
                                            text: '月度免疫'
                                        }, {
                                            value: 4,
                                            text: '物资储备'
                                        }, {
                                            value: 2,
                                            text: '春秋防周报'
                                        }, {
                                            value: 7,
                                            text: '春秋防数据汇总'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportCycle',
                                    id: 'reportCycle',
                                    label: '填报周期',
                                    inline: true,
                                    items: [
                                        {
                                            value: 7,
                                            text: '当月疫苗订购与使用管理'
                                        }, {
                                            value: 3,
                                            text: '应急物资储备管理'
                                        }, {
                                            value: 4,
                                            text: '春防/秋防管理'
                                        }, {
                                            value: 12,
                                            text: '春秋防总结'
                                        }, {
                                            value: 2,
                                            text: '防控应急管理'
                                        }
                                    ]
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/template/load/" + data.templateId)
                        modal.show()
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/template/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.templateId
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
                            id: "template_info_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_template_form",
                            name: "add_template_form",
                            method: "POST",
                            action: App.href + "/api/animal/template/insert",//表单action
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
                                    name: 'templateName',
                                    id: 'templateName',
                                    label: '报表名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入报表名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'tableName',
                                    id: 'tableName',
                                    label: '数据库表名',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入数据库表名"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'normalTemplate',
                                    id: 'normalTemplate',
                                    label: '填报模板名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入填报模板名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'summaryTemplate',
                                    id: 'summaryTemplate',
                                    label: '汇总模板名称',
                                    cls: 'input-large'
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportType',
                                    id: 'reportType',
                                    label: '填报类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: 3,
                                            text: '月度免疫'
                                        }, {
                                            value: 4,
                                            text: '物资储备'
                                        }, {
                                            value: 2,
                                            text: '春秋防周报'
                                        }, {
                                            value: 7,
                                            text: '春秋防数据汇总'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportCycle',
                                    id: 'reportCycle',
                                    label: '填报周期',
                                    inline: true,
                                    items: [
                                        {
                                            value: 7,
                                            text: '当月疫苗订购与使用管理'
                                        }, {
                                            value: 3,
                                            text: '应急物资储备管理'
                                        }, {
                                            value: 4,
                                            text: '春防/秋防管理'
                                        }, {
                                            value: 12,
                                            text: '春秋防总结'
                                        }, {
                                            value: 2,
                                            text: '防控应急管理'
                                        }
                                    ]
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
                //搜索栏元素
                items: [
                    {
                        type: "text",
                        label: "报表名称",
                        name: "templateName",
                        placeholder: "输入要搜索的报表名称"
                    }, {
                        type: "select",
                        label: "类型",
                        name: "reportType",
                        items: [
                            {
                                value: 0,
                                text: '全部'
                            },
                            {
                                value: 3,
                                text: '月度免疫'
                            }, {
                                value: 4,
                                text: '物资储备'
                            }, {
                                value: 2,
                                text: '春秋防周报'
                            }, {
                                value: 7,
                                text: '春秋防数据汇总'
                            }
                        ]
                    }
                ]
            }
        }
        grid = window.App.content.find("#template_info_grid").orangeGrid(options)
    }
})(jQuery, window, document)
