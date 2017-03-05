/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/fileDownload/pageList": "fileDownload"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.fileDownload = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="file_download_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animal/fileDownload/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "fileid",//id域指定
            headField: "realName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "文件名称",
                    field: "filename"
                }, {
                    title: '文件类型',
                    field: 'filetype'
                }, {
                    title: '最后时间',
                    field: 'filetime'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "下载",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        window.open(data.filepath);
                    }
                }
            ],
            tools: [
                {
                    text: " 添 加",//按钮文本
                    cls: "btn btn-primary",//按钮样式
                    icon: "fa fa-cubes",
                    handle: function (grid) {
                        var modal = $.orangeModal({
                            id: "file_download_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_org_form",
                            name: "add_org_form",
                            method: "POST",
                            action: App.href + "/api/animal/fileDownload/insert",
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
                                    name: 'filename',
                                    id: 'filename',
                                    label: '文件名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入文件名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'filetype',
                                    id: 'filetype',
                                    label: '文件类型',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入文件类型"
                                    }
                                }, {
                                    type: 'file',
                                    id: 'filepath',
                                    name: 'filepath',
                                    label: '文件位置',
                                    isAjaxUpload: true,
                                    onSuccess: function (data) {
                                        $("#filepath").attr("value", data.attachmentUrl);
                                    },
                                    deleteHandle: function () {
                                        $("#filepath").attr("value", "");
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请上传文件"
                                    }
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
                    label: "文件名称",
                    name: "filename",
                    placeholder: "输入要搜索的文件名称"
                }]
            }
        };
        grid = window.App.content.find("#file_download_grid").orangeGrid(options)
    };
})(jQuery, window, document)
