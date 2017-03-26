/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/report/week/fill": "weekFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.weekFill = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $(
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<i class="fa fa-bar-chart-o fa-fw"></i>填报' +
                '</div>' +
                '<div class="panel-body" id="fill_grid"></div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<i class="fa fa-bar-chart-o fa-fw"></i>补报' +
                '</div>' +
                '<div class="panel-body" id="re_fill_grid"></div>' +
                '</div>' +
                '</div>'
            )
            App.content.append(content)
            initFill()
            initReFill()
        }
    };
    var initFill = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/report/week/fill",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 5,//每页显示条数
            idField: "reportId",//id域指定
            headField: "templateName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            showContentType: false,
            pageSelect: [5, 15, 30, 50],
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
                        itemsUrl: App.href + "/api/animal/template/options?reportType=2&animal_disease_token=" + App.token
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
        grid = window.App.content.find("#fill_grid").orangeGrid(options)
    };
    var initReFill = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/report/week/reFill",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 5,//每页显示条数
            idField: "id",//id域指定
            headField: "templateName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [5, 15, 30, 50],
            showContentType: false,
            columns: [
                {
                    title: '模块名称',
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
                }, {
                    title: "报表名称",
                    field: "templateName"
                }, {
                    title: "上报期",
                    field: "reportPeriod"
                }, {
                    title: "上报状态",
                    field: "reportStatus",
                    format: function (i, d) {
                        return d.reportStatus == 1 ? "已上报" : "起草中"
                    }
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "10%",
            actionColumns: [
                {
                    cls: "btn-primary btn-sm",
                    textHandle: function (i, d) {
                        return d.reportStatus < 1 ? "填写" : "查看";
                    },
                    handle: function (index, data) {
                        var modal = {};
                        if (data.reportStatus < 1) {
                            modal = $.orangeModal({
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
                                            var flag = true;
                                            var jsonData = {}
                                            modal.$body.find("td[role=data]").each(function () {
                                                var n = $(this).attr("n");
                                                var v = $.trim($(this).text());
                                                v = v == '' ? 0 : v
                                                var re = /^[0-9]+(.[0-9]{2})?$/
                                                if (re.test(v)) {
                                                    v = parseFloat(v)
                                                } else {
                                                    alert(n + "填报必须为数且字不能小于0!");
                                                    flag = false;
                                                }
                                                jsonData[n] = v;
                                            });
                                            if (!flag)
                                                return;
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
                                                    var flag = true;
                                                    var jsonData = {}
                                                    modal.$body.find("td[role=data]").each(function () {
                                                        var n = $(this).attr("n");
                                                        var v = $.trim($(this).text());
                                                        v = v == '' ? 0 : v
                                                        var re = /^[0-9]+(.[0-9]{2})?$/
                                                        if (re.test(v)) {
                                                            v = parseFloat(v)
                                                        } else {
                                                            alert(n + "填报必须为数且字不能小于0!");
                                                            flag = false;
                                                        }
                                                        jsonData[n] = v;
                                                    });
                                                    if (!flag)
                                                        return;
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
                            });
                        } else {
                            modal = $.orangeModal({
                                id: "report_fill_modal",
                                height: 450,
                                title: "查看",
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
                            })
                        }
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
                        itemsUrl: App.href + "/api/animal/template/options?reportType=2&animal_disease_token=" + App.token
                    }
                ]
            }
        }
        grid = window.App.content.find("#re_fill_grid").orangeGrid(options)
    }

})(jQuery, window, document)
