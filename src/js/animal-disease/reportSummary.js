/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animalDisease/reportSummary/pageList": "reportSummary"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.reportSummary = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="report_summary_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animalDisease/reportSummary/pageList",
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
                    title: "ID",
                    field: "id",
                    width: "5%"
                }, {
                    title: "报表ID",
                    field: "reportId"
                }, {
                    title: "标题",
                    field: "displayTitle"
                }, {
                    title: "开始时间",
                    field: "startTime"
                }, {
                    title: "结束时间",
                    field: "endTime"
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "查看汇总",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "report_summary_modal",
                            height: 450,
                            title: "汇总",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '保存到本地',
                                    cls: "btn-info",
                                    handle: function () {
                                        App.download("/api/animalDisease/reportSummary/download/" + data.id)
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
                        }).show()
                        var requestUrl = App.href + "/api/animalDisease/reportSummary/load/" + data.id;
                        $.ajax({
                            type: "GET",
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                if (data.code === 200) {
                                    modal.content(data.data.html);
                                } else {
                                    alert(data.message)
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
                items: [{
                    type: "text",
                    label: "填报标题",
                    name: "displayTitle",
                    placeholder: "输入要搜索的填报标题"
                }]
            }
        }
        grid = window.App.content.find("#report_summary_grid").orangeGrid(options)
    }
})(jQuery, window, document)
