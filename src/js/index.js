/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var token = $.cookie('animal_disease_tc_t');
    if (token == undefined) {
        window.location.href = '../login.html';
    }
    App.token = token;

    var requestMapping = {
        "/api/index": "index"
    };
    App.requestMapping = $.extend({}, App.requestMapping, requestMapping);

    App.index = {
        page: function (title) {
            App.content.empty();
            App.title(title);
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-12" id="news_grid"></div> ' +
                '</div> ' +
                '</div>' +
                '</div>');
            App.content.append(content);
            App.index.initEvents();
        }
    };
    /**
     * 初始化事件
     */
    App.index.initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/news/pageList",
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
                    title: "标题",
                    field: "newTitle"
                }, {
                    title: '发布时间',
                    field: 'newDate'
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
                            id: "news_edit_modal",
                            title: "查看",
                            width: 900,
                            height: 500,
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
                        }).show()
                        var formOpts = {
                            id: "news_form",
                            name: "news_form",
                            method: "POST",
                            labelInline: false,
                            action: App.href + "/api/animal/news/update",
                            ajaxSubmit: true,//是否使用ajax提交表单
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
                            ajaxSuccess: function () {
                                modal.hide()
                                grid.reload()
                            },
                            submitText: "保存",//保存按钮的文本
                            showReset: false,//是否显示重置按钮
                            showSubmit: false,
                            resetText: "重置",//重置按钮文本
                            isValidate: true,//开启验证
                            buttonsAlign: "center",
                            items: [
                                {
                                    type: 'display',
                                    name: 'newTitle',
                                    id: 'newTitle',
                                    style: 'text-align: center;',
                                    label: '',
                                    format: function (i, d) {
                                        return '<h1>' + data.newTitle + '</h1>'
                                    }
                                },
                                {
                                    type: 'display',
                                    name: 'newDate',
                                    id: 'newDate',
                                    style: 'text-align: right;',
                                    label: '',
                                    format: function (i, d) {
                                        return '<h4>' +
                                            '创建时间: <span id="createTime">' + data.newDate + '</span> &nbsp;' +
                                            '阅读次数: <span id="lookAmount">' + data.newCount + '</span> ' +
                                            '</h4><hr>'
                                    }
                                },
                                {
                                    type: 'display',
                                    name: 'newBody',
                                    id: 'newBody',
                                    label: ''
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/news/load/" + data.newId)
                    }
                }
            ]
        };
        grid = window.App.content.find("#news_grid").orangeGrid(options)
    };

})(jQuery, window, document);
