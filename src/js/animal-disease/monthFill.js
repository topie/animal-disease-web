/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/report/month/fill": "monthFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.monthFill = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="month_fill_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/report/month/fill",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "templateName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            showContentType: false,
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "报表名称",
                    field: "templateName"
                }, {
                    title: "上级机构",
                    field: "orgName"
                }, {
                    title: "报表周期",
                    field: "reportPeriod"
                }, {
                    title: "上报时间",
                    field: "reportTime"
                }, {
                    title: "上报状态",
                    field: "reportStatus",
                    format: function (i, d) {
                        return d.reportStatus == 1 ? "已上报" : "起草中"
                    }
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "查看",
                    visible: function (i, d) {
                        return d.reportStatus == 1
                    },
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "report_fill_modal",
                            height: 450,
                            title: "查看",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '保存到本地',
                                    cls: "btn-info",
                                    handle: function () {
                                        App.download("/api/animal/excel/download/" + data.reportId)
                                    }
                                }, {
                                    type: 'button',
                                    text: '关闭',
                                    cls: "btn-default",
                                    handle: function () {
                                        modal.hide()
                                    }
                                }
                            ]
                        })
                        var requestUrl = App.href + "/api/animal/excel/load/" + data.reportId
                        $.ajax({
                            type: "GET",
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                if (data.code === 200) {
                                    modal.show()
                                    modal.content(data.data.html);
                                } else {
                                    alert(data.message)
                                    modal.hide()
                                }
                            },
                            error: function (e) {
                                alert("请求异常。")
                            }
                        });
                    }
                }, {
                    text: "填写",
                    visible: function (i, d) {
                        return d.reportStatus <= 0
                    },
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "report_fill_modal",
                            height: 450,
                            title: "填写",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '暂存',
                                    cls: "btn-info",
                                    handle: function () {
                                        var jsonData = {}
                                        modal.$body.find("td[role=data]").each(function () {
                                            var n = $(this).attr("n")
                                            jsonData[n] = $.trim($(this).text()) == '' ? 0 : parseFloat($(this).text())
                                        })
                                        $.ajax({
                                            type: "POST",
                                            beforeSend: function (request) {
                                                request.setRequestHeader("X-Auth-Token", App.token)
                                            },
                                            dataType: "json",
                                            data: {
                                                "data": JSON.stringify(jsonData),
                                                "reportId": data.reportId
                                            },
                                            url: App.href + "/api/animal/excel/insertOrUpdate",
                                            success: function (data) {
                                                if (data.code === 200) {
                                                    modal.hide()
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
                                }, {
                                    type: 'button',
                                    text: '上报',
                                    cls: "btn-info",
                                    handle: function () {
                                        bootbox.confirm("确定该操作?", function (result) {
                                            if (result) {
                                                var jsonData = {}
                                                modal.$body.find("td[role=data]").each(function () {
                                                    var n = $(this).attr("n")
                                                    jsonData[n] = $.trim($(this).text()) == '' ? 0 : parseFloat($(this).text())
                                                })
                                                $.ajax({
                                                    type: "POST",
                                                    beforeSend: function (request) {
                                                        request.setRequestHeader("X-Auth-Token", App.token)
                                                    },
                                                    dataType: "json",
                                                    data: {
                                                        "data": JSON.stringify(jsonData),
                                                        "reportId": data.reportId,
                                                        "reportStatus": 1
                                                    },
                                                    url: App.href + "/api/animal/excel/insertOrUpdate",
                                                    success: function (data) {
                                                        if (data.code === 200) {
                                                            modal.hide()
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
                                        })
                                    }
                                }, {
                                    type: 'button',
                                    text: '关闭',
                                    cls: "btn-default",
                                    handle: function () {
                                        modal.hide()
                                    }
                                }
                            ]
                        })
                        var requestUrl = App.href + "/api/animal/excel/load/" + data.reportId
                        $.ajax({
                            type: "GET",
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                if (data.code === 200) {
                                    modal.show()
                                    modal.content(data.data.html);
                                } else {
                                    alert(data.message)
                                    modal.hide()
                                }
                            },
                            error: function (e) {
                                alert("请求异常。")
                            }
                        });
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [
                    {
                        type: "select",
                        id: "templateId",
                        label: "报表名称",
                        name: "templateId",
                        items: [
                            {
                                text: "全部",
                                value: ""
                            }
                        ],
                        itemsUrl: App.href + "/api/animal/template/options?reportType=3&animal_disease_token=" + App.token
                    }, {
                        type: "select",
                        id: "status",
                        label: "状态",
                        name: "status",
                        items: [
                            {
                                text: "全部",
                                value: ""
                            }, {
                                text: "起草中",
                                value: 0
                            }, {
                                text: "已上报",
                                value: 1
                            }
                        ]
                    }
                ]
            }
        }
        grid = window.App.content.find("#month_fill_grid").orangeGrid(options)
    }
})(jQuery, window, document)
