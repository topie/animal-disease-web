/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animalDisease/reFill/pageList": "reFill"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.reFill = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="re_fill_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var grid = {}
        var options = {
            url: App.href + "/api/animalDisease/reFill/pageList",
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
                    title: "填报ID",
                    field: "fillId"
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
                    text: "编辑",
                    cls: "btn-primary btn-sm",
                    handle: function (index, data) {
                        var modal = $.orangeModal({
                            id: "re_fill_edit_modal",
                            title: "编辑",
                            destroy: true
                        })
                        var formOpts = {
                            id: "re_fill_form",//表单id
                            name: "re_fill_form",//表单名
                            method: "POST",//表单method
                            action: App.href + "/api/animalDisease/reFill/update",//表单action
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
                                    type: 'tree',//类型
                                    name: 'fillId',
                                    id: 'fillId',//id
                                    label: '填报项',//左边label
                                    url: App.href + "/api/animalDisease/normalFill/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个填报项"
                                    }
                                }, {
                                    type: 'tree',//类型
                                    name: 'orgId',
                                    id: 'orgId',//id
                                    label: '补填报组织机构',//左边label
                                    url: App.href + "/api/animalDisease/orgInfo/treeNodes?animal_disease_token=" + App.token,
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
                                    type: 'datepicker',
                                    name: 'startTime',
                                    id: 'startTime',
                                    label: '开始日期',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'endTime',
                                    id: 'endTime',
                                    label: '结束日期',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    }
                                }
                            ]
                        };
                        var form = modal.$body.orangeForm(formOpts)
                        form.loadRemote(App.href + "/api/animalDisease/reFill/load/" + data.id)
                        modal.show()
                    }
                }, {
                    text: "删除",
                    cls: "btn-danger btn-sm",
                    handle: function (index, data) {
                        bootbox.confirm("确定该操作?", function (result) {
                            if (result) {
                                var requestUrl = App.href + "/api/animalDisease/reFill/delete";
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
                            id: "re_fill_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_report_form",
                            name: "add_report_form",
                            method: "POST",
                            action: App.href + "/api/animalDisease/reFill/insert",//表单action
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
                                    type: 'tree',//类型
                                    name: 'fillId',
                                    id: 'fillId',//id
                                    label: '填报项',//左边label
                                    url: App.href + "/api/animalDisease/normalFill/treeNodes?animal_disease_token=" + App.token,
                                    expandAll: true,
                                    autoParam: ["id", "name", "pId"],
                                    chkStyle: "radio",
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个填报项"
                                    }
                                }, {
                                    type: 'tree',//类型
                                    name: 'orgId',
                                    id: 'orgId',//id
                                    label: '补填报组织机构',//左边label
                                    url: App.href + "/api/animalDisease/orgInfo/treeNodes?animal_disease_token=" + App.token,
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
                                    type: 'datepicker',
                                    name: 'startTime',
                                    id: 'startTime',
                                    label: '开始日期',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
                                    }
                                }, {
                                    type: 'datepicker',
                                    name: 'endTime',
                                    id: 'endTime',
                                    label: '结束日期',
                                    config: {
                                        timePicker: true,
                                        singleDatePicker: true,
                                        locale: {
                                            format: 'YYYY-MM-DD HH:mm:ss'
                                        }
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
                    label: "补填报标题",
                    name: "displayTitle",
                    placeholder: "输入要搜索的补填报标题"
                }]
            }
        }
        grid = window.App.content.find("#re_fill_grid").orangeGrid(options)
    }
})(jQuery, window, document)
