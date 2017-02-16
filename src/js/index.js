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
                '<div class="col-md-6" id="index_grid"></div> ' +
                '<div class="col-md-6">' +
                '<div class="row">' +
                '<div class="col-md-12" id="index_manager"></div>' +
                '<div class="col-md-12" id="index_manager2"></div>' +
                '</div>' +
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
        var formOpts = {
            id: "index_form",//表单id
            name: "index_form",//表单名
            method: "post",//表单method
            action: "",//表单action
            ajaxSubmit: true,//是否使用ajax提交表单
            labelInline: false,
            rowEleNum: 2,
            beforeSubmit: function () {
            },
            ajaxSuccess: function () {
            },
            submitText: "保存",//保存按钮的文本
            showReset: true,//是否显示重置按钮
            resetText: "重置",//重置按钮文本
            isValidate: true,//开启验证
            buttons: [{
                type: 'button',
                text: '加载',
                handle: function () {
                    form.setValue("attachmentIds", 1);
                    form.setValue("roles", "1,2,3");
                    form.setValue("html", "aaaa");
                    form.setValue("introduce", "aaaa");
                }
            }],
            buttonsAlign: "center",
            //表单元素
            items: [{
                type: 'text',//类型
                name: 'name1',//name
                id: 'name1',//id
                label: '角色名',//左边label
                cls: 'input-large',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入角色名"
                }
            }, {
                type: 'file',
                id: 'templatePath',
                name: 'templatePath',
                label: '模板路径',
                isAjaxUpload: true,
                onSuccess: function (data) {
                    $("#templatePath").attr("value", data.attachmentUrl);
                },
                deleteHandle: function () {
                    $("#templatePath").attr("value", "");
                },
                rule: {
                    required: true
                },
                message: {
                    required: "请上传文件"
                }
            }, {
                type: 'image',
                id: 'image',
                name: 'image',
                label: '模板图片',
                isAjaxUpload: true,
                onSuccess: function (data) {
                    $("#image").attr("value", data.attachmentUrl);
                },
                deleteHandle: function () {
                    $("#image").attr("value", "");
                },
                rule: {
                    required: true
                },
                message: {
                    required: "请上传文件"
                }
            }, {
                type: 'tree',//类型
                name: 'roles',//name
                id: 'roles',//id
                label: '菜单',//左边label
                url: App.href + "/api/sys/function/treeNodes?animal_disease_token=" + App.token,
                data: {},
                expandAll: true,
                autoParam: ["id", "name", "pId"],
                chkStyle: "checkbox",
                rule: {
                    required: true
                },
                message: {
                    required: "请选择至少一项菜单"
                }
            }, {
                type: 'datepicker',
                name: 'datepicker',
                id: 'datepicker',
                label: '时间选择器',
                span: '4',
                config: {
                    timePicker: false,
                    singleDatePicker: true,
                    locale: {
                        format: 'YYYY-MM-DD'
                    }
                },
                rule: {
                    required: true
                },
                message: {
                    required: "请选择日期"
                }
            }, {
                type: 'kindEditor',
                name: 'introduce',
                id: 'introduce',
                label: '影片介绍',
                height: "300px",
                rule: {
                    required: true
                },
                message: {
                    required: "影片介绍"
                }
            }, {
                type: 'files',
                id: 'attachmentIds',
                name: 'attachmentIds',
                limit: 1,
                label: '上传附件',
                rule: {
                    required: true
                },
                message: {
                    required: "上传附件"
                }
            }, {
                type: 'html',
                id: 'html',
                name: 'html',
                label: '自定义html',
                html: '<div class="row">' +
                '<div class="col-lg-12">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading"><a href="javascript:void(0);">New vs Returning Visitors</a></div>' +
                '<div class="panel-body"><p class="content">Pellentesque luctus quam quis consequat vulputate. Sed sit amet diam ipsum. Praesent in</p> ' +
                '</div> ' +
                '</div> </div>',
                eventHandle: function (ele) {
                    ele.find("a").click(function (e) {
                        alert("我点击了自定义链接");
                        e.preventDefault();
                    });
                },
                loadHandle: function (ele, value) {
                    ele.find("p.content").html(value);
                }
            }]
        };
        var form = App.content.find("#index_grid").orangeForm(formOpts);
        var manager = App.content.find("#index_manager").fileManager();
        var manager2 = App.content.find("#index_manager2").fileManager({
            title: 'oss',
            url: {
                upload: App.href + "/api/ossFileManager/upload",
                folder: App.href + "/api/ossFileManager/folder",
                createFolder: App.href + "/api/ossFileManager/createFolder",
                rename: App.href + "/api/ossFileManager/rename",
                deleteFile: App.href + "/api/ossFileManager/deleteFile",
                deleteFolder: App.href + "/api/ossFileManager/deleteFolder",
                download: App.href + "/api/ossFileManager/download",
                zip: App.href + "/api/ossFileManager/zip",
                unCompress: App.href + "/api/ossFileManager/unCompress"
            }
        });
    };

})(jQuery, window, document);
