/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/sys/log/pageList": "log"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.log = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="log_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/sys/log/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "newId",//id域指定
            headField: "newTitle",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "日志内容",
                    field: "logInfo"
                }, {
                    title: '日志时间',
                    field: 'logTime'
                }, {
                    title: '操作人',
                    field: 'userName'
                }
            ],
            search: {
                rowEleNum: 2,
                //搜索栏元素
                items: [{
                    type: "text",
                    label: "操作人",
                    name: "userName",
                    placeholder: "操作人"
                }]
            }
        };
        grid = window.App.content.find("#log_grid").orangeGrid(options)
    };
})(jQuery, window, document)
