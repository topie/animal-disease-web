/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/report/halfYear/history": "halfYearHistory"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.halfYearHistory = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="halfYear_history_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/report/halfYear/history",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "reportId",//id域指定
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
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "report_summary_modal",
                            height: 450,
                            title: "查看",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '保存到本地',
                                    cls: "btn-info",
                                    handle: function () {
                                        window.open("/api/animal/excel/download/" + data.reportId+ "?animal_disease_token=" + App.token)
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
                        itemsUrl: App.href + "/api/animal/template/options?reportType=7&animal_disease_token=" + App.token
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
                    }, {
                        type: "html",
                        label: "报表所属时间段",
                        eleHandle: function () {
                            var p = $('<p></p>')
                            var ele = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                '</select>')
                            var date = new Date;
                            var year = date.getFullYear();
                            for (var i = year; i > 2008; i--) {
                                var op = '<option value=' + i + '>' + i + '</option>'
                                ele.append(op)
                            }
                            p.append(ele)
                            var ele2 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                '<option value=3>春防</option>' +
                                '<option value=9>秋防</option>' +
                                '</select>')
                            p.append(ele2)
                            var month = date.getMonth() + 1
                            var halfYear = 3;
                            if (month >= 3 && month < 9) {
                                halfYear = 3;
                            } else {
                                halfYear = 9;
                            }
                            ele2.val(halfYear)
                            return p
                        }
                    }
                ]
            }
        }
        grid = window.App.content.find("#halfYear_history_grid").orangeGrid(options)
    }
})(jQuery, window, document)
