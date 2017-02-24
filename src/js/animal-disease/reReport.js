/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/reReport/pageList": "reReport"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.reReport = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="re_report_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/reReport/pageList",
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
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "机构",
                    field: "orgName"
                }, {
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
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "10%",
            actionColumns: [
                {
                    text: "关闭",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/reReport/delete";
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
                }],
            tools: [
                {
                    text: " 添 加",//按钮文本
                    cls: "btn btn-primary",//按钮样式
                    icon: "fa fa-cubes",
                    handle: function (grid) {

                    }
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [{
                    type: "text",
                    label: "模板名称",
                    name: "templateName",
                    placeholder: "输入要搜索的模板名称"
                }]
            }
        };
        grid = window.App.content.find("#re_report_grid").orangeGrid(options)
    };
})(jQuery, window, document)
