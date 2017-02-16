/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animalDisease/orgInfo/pageList": "orgInfo"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.orgInfo = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="org_info_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animalDisease/orgInfo/pageList",
            beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", App.token);
            },
            pageNum: 1,//当前页码
            pageSize: 15,//每页显示条数
            idField: "orgId",//id域指定
            headField: "realName",
            showCheck: true,//是否显示checkbox
            checkboxWidth: "3%",
            showIndexNum: true,
            indexNumWidth: "5%",
            pageSelect: [2, 15, 30, 50],
            columns: [
                {
                    title: "ID",
                    field: "orgId",
                    width: "5%"
                }, {
                    title: "机构名称",
                    field: "orgName"
                }, {
                    title: '区划编码',
                    field: 'orgCode'
                }
            ],
            actionColumnText: "操作",//操作列文本
            actionColumnWidth: "20%",
            actionColumns: [
                {
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "org_info_edit_modal",
                            title: "编辑",
                            destroy: true
                        })
                        var formOpts = {
                            id: "org_info_form",
                            name: "org_info_form",
                            method: "POST",
                            action: App.href + "/api/animalDisease/orgInfo/update",
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
                                    name: 'orgId',
                                    id: 'orgId'
                                }, {
                                    type: 'text',
                                    name: 'orgName',
                                    id: 'orgName',
                                    label: '机构名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入机构名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'orgCode',
                                    id: 'orgCode',
                                    label: '区划编码',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入机构名称"
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animalDisease/orgInfo/load/" + data.orgId)
                        modal.show()
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animalDisease/orgInfo/delete";
                                $.ajax({
                                    type: "POST",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("X-Auth-Token", App.token)
                                    },
                                    dataType: "json",
                                    data: {
                                        id: data.orgId
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
                            id: "org_info_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_org_form",
                            name: "add_org_form",
                            method: "POST",
                            action: App.href + "/api/animalDisease/orgInfo/insert",
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
                                    name: 'orgName',
                                    id: 'orgName',
                                    label: '机构名称',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入机构名称"
                                    }
                                }, {
                                    type: 'text',
                                    name: 'orgCode',
                                    id: 'orgCode',
                                    label: '区划编码',
                                    cls: 'input-large',
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请输入机构名称"
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
                    label: "机构名称",
                    name: "orgName",
                    placeholder: "输入要搜索的机构名称"
                }]
            }
        };
        grid = window.App.content.find("#org_info_grid").orangeGrid(options)
    };
})(jQuery, window, document)
