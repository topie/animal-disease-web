/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/specFill/pageList": "specFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.specFill = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="specFill_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/specFill/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "id",//id域指定
            headField: "orgName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "类型",
                    field: "type",
                    format: function (i, d) {
                        return d.type == 1 ? '应急预备队' : '应急指挥系统';
                    }
                }, {
                    title: '组织机构',
                    field: 'orgName'
                }, {
                    title: '最后修改时间',
                    field: 'uTime'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: '填写',
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
                                    text: '保存',
                                    cls: "btn-primary",
                                    handle: function () {
                                        var content = modal.$body.html();
                                        $.ajax({
                                            type: "POST",
                                            dataType: "json",
                                            data: {
                                                "tableContent": content,
                                                "id": data.id
                                            },
                                            url: App.href + "/api/animal/specFill/update",
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
                                    text: '添加行',
                                    cls: "btn-info",
                                    handle: function () {
                                        var newTr = modal.$body.find("tbody > tr:last").clone(true);
                                        newTr.find("td").each(function (i) {
                                            $(this).html("");
                                        });
                                        modal.$body.find("tbody").append(newTr);
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
                        var requestUrl = App.href + "/api/animal/specFill/load/" + data.id
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
                                    modal.content(data.data.tableContent);
                                    modal.$body.find("table.t1").css("width","100%");
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
                }]
        };
        grid = window.App.content.find("#specFill_grid").orangeGrid(options)
    };
})(jQuery, window, document)
