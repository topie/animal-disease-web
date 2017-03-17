/**
 * Created by chenguojun on 8/10/16.
 */

(function ($, window, document, undefined) {
    var mapping = {
        "/api/animal/generateReport/do": "generateReport"
    };
    App.requestMapping = $.extend({}, window.App.requestMapping, mapping);
    App.generateReport = {
        page: function (title) {
            App.content.empty()
            App.title(title)
            var content = $('<div class="panel-body" id="generate_report_grid"></div>')
            App.content.append(content)
            initEvents()
        }
    };
    var initEvents = function () {
        var formOpts = {
            id: "add_generate_report_form",
            name: "add_generate_report_form",
            method: "POST",
            action: App.href + "/api/animal/generateReport/do",
            ajaxSubmit: true,//是否使用ajax提交表单
            rowEleNum: 1,
            ajaxSuccess: function (data) {
                if (data.code == 200) {
                    alert("生成成功");
                } else {
                    alert("生成失败");
                }
            },
            submitText: "生成",//保存按钮的文本
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
        App.content.find("#generate_report_grid").orangeForm(formOpts)
    };
})(jQuery, window, document)
