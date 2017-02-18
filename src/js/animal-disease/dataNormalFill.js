/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animalDisease/reportData/normalFill": "dataNormalFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.dataNormalFill = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="data_normal_fill_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animalDisease/reportData/normalFill",
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
                    text: "填写",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "data_normal_fill_modal",
                            height: 500,
                            title: "填写",
                            destroy: true,
                            buttons: [
                                {
                                    type: 'button',
                                    text: '暂存',
                                    cls: "btn-warning",
                                    handle: function () {

                                    }
                                }, {
                                    type: 'button',
                                    text: '提交',
                                    cls: "btn-primary",
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
                                                "id": data.id
                                            },
                                            url: App.href + "/api/animalDisease/reportData/normalFill/upsert",
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
                                }
                            ]
                        }).show()
                        var requestUrl = App.href + "/api/animalDisease/reportData/normalFill/" + data.id;
                        $.ajax({
                            type: "GET",
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            dataType: "json",
                            url: requestUrl,
                            success: function (data) {
                                if (data.code === 200) {
                                    console.info(data);
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
        grid = window.App.content.find("#data_normal_fill_grid").orangeGrid(options)
    }
})(jQuery, window, document)
