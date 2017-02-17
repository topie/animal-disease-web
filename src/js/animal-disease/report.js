/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animalDisease/report/pageList": "reportInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.reportInfo = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="report_info_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animalDisease/report/pageList",
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
                    title: "报表ID",
                    field: "reportId",
                    width: "5%"
                }, {
                    title: "报表名",
                    field: "reportName"
                }, {
                    title: "报表类型",
                    field: "reportType",
                    format: function (i,data) {
                        switch (data.reportType) {
                            case 1:
                                return '月报'
                                break
                            case 2:
                                return '周报'
                                break
                            case 3:
                                return '统计'
                                break
                            case 4:
                                return '其他'
                                break
                            default:
                                return '-'
                                break
                        }
                    }
                }, {
                    title: '栏目',
                    field: 'reportCategory',
                    format: function (i,data) {
                        switch (data.reportCategory) {
                            case 1:
                                return '月度免疫'
                                break
                            case 2:
                                return '春秋防周报'
                                break
                            case 3:
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
                    title: '填报频率',
                    field: 'reportPeriod',
                    format: function (i,data) {
                        switch (data.reportPeriod) {
                            case 1:
                                return '月度'
                                break
                            case 2:
                                return '周报'
                                break
                            case 3:
                                return '半年'
                                break
                            case 4:
                                return '季度'
                                break
                            case 4:
                                return '实时'
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
                            id: "report_info_edit_modal",
                            title: "编辑",
                            destroy: true
                        })
                        var formOpts = {
                            id: "report_info_form",//表单id
                            name: "report_info_form",//表单名
                            method: "POST",//表单method
                            action: App.href + "/api/animalDisease/report/update",//表单action
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
                                    name: 'reportId',
                                    id: 'reportId'
                                }, {
                                    type: 'text',
                                    name: 'reportName',
                                    id: 'reportName',
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
                                    name: 'reportTemplateName',
                                    id: 'reportTemplateName',
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
                                    name: 'summaryTemplateName',
                                    id: 'summaryTemplateName',
                                    label: '汇总模板名称',
                                    cls: 'input-large'
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportType',
                                    id: 'reportType',
                                    label: '报表类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月报'
                                        }, {
                                            value: 2,
                                            text: '周报'
                                        }, {
                                            value: 3,
                                            text: '统计'
                                        }, {
                                            value: 4,
                                            text: '其他'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportCategory',
                                    id: 'reportCategory',
                                    label: '栏目',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月度免疫'
                                        }, {
                                            value: 2,
                                            text: '春秋防周报'
                                        }, {
                                            value: 3,
                                            text: '春秋防数据汇总'
                                        }, {
                                            value: 4,
                                            text: '物资储备'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportPeriod',
                                    id: 'reportPeriod',
                                    label: '填报频率',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月度'
                                        }, {
                                            value: 2,
                                            text: '周报'
                                        }, {
                                            value: 3,
                                            text: '半年'
                                        }, {
                                            value: 4,
                                            text: '季度'
                                        }, {
                                            value: 5,
                                            text: '实时'
                                        }
                                    ]
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animalDisease/report/load/" + data.reportId)
                        modal.show()
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animalDisease/report/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.reportId
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
                            id: "report_info_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_report_form",
                            name: "add_report_form",
                            method: "POST",
                            action: App.href + "/api/animalDisease/report/insert",//表单action
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
                                    name: 'reportName',
                                    id: 'reportName',
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
                                    name: 'reportTemplateName',
                                    id: 'reportTemplateName',
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
                                    name: 'summaryTemplateName',
                                    id: 'summaryTemplateName',
                                    label: '汇总模板名称',
                                    cls: 'input-large'
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportType',
                                    id: 'reportType',
                                    label: '报表类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月报'
                                        }, {
                                            value: 2,
                                            text: '周报'
                                        }, {
                                            value: 3,
                                            text: '统计'
                                        }, {
                                            value: 4,
                                            text: '其他'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportCategory',
                                    id: 'reportCategory',
                                    label: '栏目',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月度免疫'
                                        }, {
                                            value: 2,
                                            text: '春秋防周报'
                                        }, {
                                            value: 3,
                                            text: '春秋防数据汇总'
                                        }, {
                                            value: 4,
                                            text: '物资储备'
                                        }
                                    ]
                                }, {
                                    type: 'radioGroup',
                                    name: 'reportPeriod',
                                    id: 'reportPeriod',
                                    label: '填报频率',
                                    inline: true,
                                    items: [
                                        {
                                            value: 1,
                                            text: '月度'
                                        }, {
                                            value: 2,
                                            text: '周报'
                                        }, {
                                            value: 3,
                                            text: '半年'
                                        }, {
                                            value: 4,
                                            text: '季度'
                                        }, {
                                            value: 5,
                                            text: '实时'
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
                items: [{
                    type: "text",
                    label: "报表名称",
                    name: "reportName",
                    placeholder: "输入要搜索的报表名称"
                }]
            }
        }
        grid = window.App.content.find("#report_info_grid").orangeGrid(options)
    }
})(jQuery, window, document)
