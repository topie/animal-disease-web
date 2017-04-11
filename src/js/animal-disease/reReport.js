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
                                var requestUrl = App.href + "/api/animal/reReport/close";
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
                            id: "org_info_add_modal",
                            title: "添加",
                            destroy: true
                        })
                        var formOpts = {
                            id: "add_re_report_form",
                            name: "add_re_report_form",
                            method: "POST",
                            action: App.href + "/api/animal/reReport/insert",
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
                                    name: 'reportType',
                                    id: 'reportType',
                                    label: '填报类型',
                                    inline: true,
                                    items: [
                                        {
                                            value: '',
                                            text: '请选择'
                                        }, {
                                            value: 3,
                                            text: '月度免疫'
                                        }, {
                                            value: 4,
                                            text: '物资储备'
                                        }, {
                                            value: 2,
                                            text: '春秋防周报'
                                        }, {
                                            value: 7,
                                            text: '春秋防数据汇总'
                                        }
                                    ],
                                    change: function (f, value) {
                                        var t = f._module['templateId'];
                                        var tData = t.data("data");
                                        tData.itemsUrl = App.href + "/api/animal/template/options?reportType=" + value + "&animal_disease_token=" + App.token;
                                        f._module['templateId'].data("data", tData);
                                        f._refreshItem('templateId');

                                        var p = f._module['period'];
                                        var pData = p.data("data");
                                        pData.handleParams.type = value;
                                        f._module['period'].data("data", pData);
                                        f._refreshItem('period');
                                    },
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个填报类型"
                                    }
                                },
                                {
                                    type: "select",
                                    id: "templateId",
                                    label: "报表名称",
                                    name: "templateId",
                                    items: [
                                        {
                                            text: "请选择",
                                            value: ""
                                        }
                                    ],
                                    itemsUrl: App.href + "/api/animal/template/options?reportType=-1&animal_disease_token=" + App.token,
                                    rule: {
                                        required: true
                                    },
                                    message: {
                                        required: "请选择一个报表名称"
                                    }
                                },
                                {
                                    type: 'html',
                                    name: 'period',
                                    id: 'period',
                                    label: '上报期',
                                    cls: 'input-large',
                                    handleParams: {
                                        'type': 0
                                    },
                                    eleHandle: function (handleParams) {
                                        var p = $('<p></p>');
                                        var ele = {};
                                        if (handleParams.type == 7) {
                                            ele = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '</select>')
                                            var date = new Date;
                                            var year = date.getFullYear();
                                            for (var i = year; i > 2008; i--) {
                                                var op = '<option value=' + i + '>' + i + '</option>'
                                                ele.append(op)
                                            }
                                            p.append(ele)
                                            var ele2 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '<option value=3>春防</option>' +
                                                '<option value=9>秋防</option>' +
                                                '</select>')
                                            p.append(ele2)
                                            var month = date.getMonth() + 1
                                            var halfYear = 3;
                                            if (month >= 3 && month < 9) {
                                                halfYear = 3;
                                            } else {
                                                halfYear = 9;
                                            }
                                            ele2.val(halfYear)
                                        } else if (handleParams.type == 2) {
                                            ele = $('<select id="wYear" style="float: left;width: 33%" class="form-control">' +
                                                '</select>');
                                            var date = new Date;
                                            var year = date.getFullYear();
                                            for (var i = year; i > 2008; i--) {
                                                var op = '<option value=' + i + '>' + i + '</option>';
                                                ele.append(op)
                                            }
                                            p.append(ele);
                                            var ele2 = $('<select id="wType" style="float: left;width: 33%" class="form-control">' +
                                                '<option value=0>春防</option>' +
                                                '<option value=1>秋防</option>' +
                                                '</select>');
                                            p.append(ele2);
                                            var month = date.getMonth() + 1;
                                            var type = 0;
                                            if (month < 9) {
                                                type = 0;
                                            } else {
                                                type = 1;
                                            }
                                            ele2.val(type);
                                            var ele3 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '</select>');
                                            p.append(ele3);
                                            ele.on("change", function () {
                                                $.ajax({
                                                    type: "POST",
                                                    beforeSend: function (request) {
                                                        request.setRequestHeader("X-Auth-Token", App.token)
                                                    },
                                                    dataType: "json",
                                                    url: App.href + "/api/animal/report/week/options",
                                                    data: {
                                                        "year": $("#wYear").val(),
                                                        "type": $("#wType").val()
                                                    },
                                                    success: function (data) {
                                                        ele3.empty();
                                                        var ep = $('<option value="">请选择</option>');
                                                        ele3.append(ep);
                                                        $.each(data, function (i, d) {
                                                            var op = $('<option value="' + d.value + '">' + d.text + '</option>');
                                                            ele3.append(op);
                                                        });
                                                    },
                                                    error: function (e) {
                                                        alert("请求异常。")
                                                    }
                                                });
                                            });
                                            ele2.on("change", function () {
                                                $.ajax({
                                                    type: "POST",
                                                    beforeSend: function (request) {
                                                        request.setRequestHeader("X-Auth-Token", App.token)
                                                    },
                                                    dataType: "json",
                                                    url: App.href + "/api/animal/report/week/options",
                                                    data: {
                                                        "year": $("#wYear").val(),
                                                        "type": $("#wType").val()
                                                    },
                                                    success: function (data) {
                                                        ele3.empty();
                                                        var ep = $('<option value="">请选择</option>');
                                                        ele3.append(ep);
                                                        $.each(data, function (i, d) {
                                                            var op = $('<option value="' + d.value + '">' + d.text + '</option>');
                                                            ele3.append(op);
                                                        });
                                                    },
                                                    error: function (e) {
                                                        alert("请求异常。")
                                                    }
                                                });
                                            });
                                            $.ajax({
                                                type: "POST",
                                                beforeSend: function (request) {
                                                    request.setRequestHeader("X-Auth-Token", App.token)
                                                },
                                                dataType: "json",
                                                url: App.href + "/api/animal/report/week/options",
                                                data: {
                                                    "year": $("#wYear").val(),
                                                    "type": $("#wType").val()
                                                },
                                                success: function (data) {
                                                    ele3.empty();
                                                    var ep = $('<option value="">请选择</option>');
                                                    ele3.append(ep);
                                                    $.each(data, function (i, d) {
                                                        var op = $('<option value="' + d.value + '">' + d.text + '</option>');
                                                        ele3.append(op);
                                                    });
                                                },
                                                error: function (e) {
                                                    alert("请求异常。")
                                                }
                                            });
                                        } else if (handleParams.type == 4) {
                                            ele = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '</select>')
                                            var date = new Date;
                                            var year = date.getFullYear();
                                            for (var i = year; i > 2008; i--) {
                                                var op = '<option value=' + i + '>' + i + '</option>'
                                                ele.append(op)
                                            }
                                            p.append(ele)
                                            var ele2 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '<option value=1>第一季度</option>' +
                                                '<option value=4>第二季度</option>' +
                                                '<option value=7>第三季度</option>' +
                                                '<option value=10>第四季度</option>' +
                                                '</select>')
                                            p.append(ele2)
                                            var month = date.getMonth() + 1
                                            var season = 1;
                                            if (month >= 1 && month < 4) {
                                                season = 1;
                                            } else if (month >= 4 && month < 7) {
                                                season = 4;
                                            } else if (month >= 7 && month < 10) {
                                                season = 7;
                                            } else {
                                                season = 10;
                                            }
                                            ele2.val(season)
                                        } else if (handleParams.type == 3) {
                                            ele = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '</select>')
                                            var date = new Date;
                                            var year = date.getFullYear();
                                            for (var i = year; i > 2008; i--) {
                                                var op = '<option value=' + i + '>' + i + '</option>'
                                                ele.append(op)
                                            }
                                            p.append(ele)
                                            p.append('<p style="float: left">年</p>')
                                            var ele2 = $('<select name="period" style="float: left;width: 33%" class="form-control">' +
                                                '<option value=1>1</option>' +
                                                '<option value=2>2</option>' +
                                                '<option value=3>3</option>' +
                                                '<option value=4>4</option>' +
                                                '<option value=5>5</option>' +
                                                '<option value=6>6</option>' +
                                                '<option value=7>7</option>' +
                                                '<option value=8>8</option>' +
                                                '<option value=9>9</option>' +
                                                '<option value=10>10</option>' +
                                                '<option value=11>11</option>' +
                                                '<option value=12>12</option>' +
                                                '</select>')
                                            p.append(ele2)
                                            var month = date.getMonth() + 1
                                            ele2.val(month)
                                            p.append('<p style="float: left">月</p>')
                                        }
                                        return p
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
                items: [
                    {
                        type: "select",
                        id: "templateId",
                        label: "报表名称",
                        name: "templateId",
                        items: [
                            {
                                text: "全部",
                                value: ""
                            }
                        ],
                        itemsUrl: App.href + "/api/animal/template/options?animal_disease_token=" + App.token
                    },
                    {
                        type: "select",
                        id: "orgId",
                        label: "组织机构",
                        name: "orgId",
                        items: [
                            {
                                text: "全部",
                                value: ""
                            }
                        ],
                        itemsUrl: App.href + "/api/animal/orgInfo/options?animal_disease_token=" + App.token
                    }
                ]
            }
        };
        grid = window.App.content.find("#re_report_grid").orangeGrid(options)
    };
})(jQuery, window, document)
