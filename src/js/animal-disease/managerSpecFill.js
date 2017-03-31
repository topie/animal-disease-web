/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/specFill/managerPageList": "managerSpecFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.managerSpecFill = {
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
            url: App.href + "/api/animal/specFill/managerPageList",
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
                    field: "type"
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
                                            beforeSend: function (request) {
                                                request.setRequestHeader("X-Auth-Token", App.token)
                                            },
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
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "specFill_edit_modal",
                            title: "编辑",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "specFill_form",
                            name: "specFill_form",
                            method: "POST",
                            action: App.href + "/api/animal/specFill/update",
                            ajaxSubmit: true,//是否使用ajax提交表单
                            beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", App.token)
                            },
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
                                    type: 'hidden',
                                    name: 'id',
                                    id: 'id'
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '填报类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: '',
                                            text: '请选择'
                                        }, {
                                            value: 1,
                                            text: '应急预备队'
                                        }, {
                                            value: 2,
                                            text: '应急指挥系统'
                                        }
                                    ],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个填报类型"
                                    }
                                }, {
                                    type: 'tree',
                                    name: 'orgId',
                                    id: 'orgId',
                                    label: '组织机构',
                                    url: App.href + "/api/animal/orgInfo/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个机构"
                                    }
                                }, {
                                    type: 'file',
                                    id: 'xlsPath',
                                    name: 'xlsPath',
                                    label: '上传附件',
                                    isAjaxUpload: true,
                                    onSuccess: function (data) {
                                        $("#xlsPath").attr("value", data.attachmentPath);
                                    },
                                    deleteHandle: function () {
                                        $("#xlsPath").attr("value", "");
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animal/specFill/load/" + data.id)
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animal/specFill/delete";
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
                        var modal = $.orangeModal({
                            id: "specFill_add_modal",
                            title: "添加",
                            destroy: true
                        }).show()
                        var formOpts = {
                            id: "add_org_form",
                            name: "add_org_form",
                            method: "POST",
                            action: App.href + "/api/animal/specFill/insert",
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
                                    type: 'tree',
                                    name: 'orgId',
                                    id: 'orgId',
                                    label: '组织机构',
                                    url: App.href + "/api/animal/orgInfo/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    hideSearch: false,
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个机构"
                                    }
                                }, {
                                    type: 'select',
                                    name: 'type',
                                    id: 'type',
                                    label: '填报类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: '',
                                            text: '请选择'
                                        }, {
                                            value: 1,
                                            text: '应急预备队'
                                        }, {
                                            value: 2,
                                            text: '应急指挥系统'
                                        }
                                    ],
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个填报类型"
                                    }
                                }, {
                                    type: 'file',
                                    id: 'xlsPath',
                                    name: 'xlsPath',
                                    label: '上传附件',
                                    isAjaxUpload: true,
                                    onSuccess: function (data) {
                                        $("#xlsPath").attr("value", data.attachmentId);
                                    },
                                    alowType: "xls",
                                    deleteHandle: function () {
                                        $("#xlsPath").attr("value", "");
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
                    }
                }
            ],
            search: {
                rowEleNum: 2,
                items: [
                    {
                        type: "text",
                        label: "组织机构",
                        name: "orgName",
                        placeholder: "搜索标题"
                    }
                ]
            }
        };
        grid = window.App.content.find("#specFill_grid").orangeGrid(options)
    };
})(jQuery, window, document)
