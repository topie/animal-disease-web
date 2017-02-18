/**
 * Created by chenguojun on 8/29/16.
 */
;
(function ($, window, document, undefined) {
    var Grid = function (element, options) {
        this._setVariable(element, options);
        this._setOptions(this._options);
        this._initEmpty();
        if (!this._autoLoad)
            return
        if (this._url != undefined) {
            this._load();
            return
        }
        if (this._data != undefined) {
            this._init();
            return
        }
        console.error("data或url未定义");
    };
    var dateDefaults = {};
    if (typeof(moment) != "undefined") {
        dateDefaults = {
            showDropdowns: true,
            linkedCalendars: false,
            autoApply: false,
            ranges: {
                '今天': [moment().startOf('day'), moment().startOf('day')],
                '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                '最近七天': [moment().subtract(6, 'days'), moment()],
                '最近三十天': [moment().subtract(29, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                "format": 'YYYY-MM-DD HH:mm:ss',
                "separator": " 到 ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "从",
                "toLabel": "到",
                "customRangeLabel": "自定义",
                "daysOfWeek": [
                    "周日",
                    "周一",
                    "周二",
                    "周三",
                    "周四",
                    "周五",
                    "周六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            },
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true
        };
    }
    Grid.defaults = {
        autoLoad: true,
        pageNum: 1,
        pageSize: 5,
        showCheck: false,
        checkboxWidth: "2%",
        showIndexNum: true,
        indexNumWidth: "2%",
        indexNumText: "序号",
        contentType: "table",
        showContentType: true,
        showSearch: true,
        showPaging: true,
        simplePaging: false,
        actionColumnText: "操作",
        actionColumnAlign: "left",
        actionColumnWidth: "20%",
        pageSelect: [10, 15, 20, 50]
    };
    Grid.statics = {
        toolRowTmpl: '<div class="table-toolbar"><div class="row">'
        + '<div ele-type="tools" class="col-md-6"></div>'
        + '<div ele-type="dropdowns" class="col-md-6"></div>'
        + '</div></div>',
        dropdownTmpl: '<div class="btn-group"><button class="btn ${cls_} dropdown-toggle" data-toggle="dropdown"  aria-expanded="true">${text_}<i class="fa fa-angle-down"></i></button>'
        + '<ul class="dropdown-menu" role="menu"></ul></div>',
        liTmpl: '<li><a href="javascript:;">${text_}</a></li>',
        searchRowTmpl: '<div class="form"><form ele-type="search" role="form">'
        + '<div class="form-body"><div class="row"></div></div>'
        + '<div class="form-actions right" style="background: none;"></div>'
        + '</form></div>',
        searchElementTmpl: '<div class="col-md-${span_}"><div class="form-group">'
        + '</div></div>',
        gridWrapperTmpl: '<div id="${id_}_wrapper" class="dataTables_wrapper no-footer"></div>',
        tableRowTmpl: '<div role="content" class="table-scrollable"></div>',
        cardRowTmpl: '<div role="content" class="table-scrollable" style="margin-top: 10px;margin-bottom: 0px;"></div>',
        listRowTmpl: '<div role="content" class="table-scrollable" style="margin-top: 10px;margin-bottom: 0px;"></div>',
        pagingRowTmpl: '<div class="row"><div role="select" class="col-md-2 col-sm-6"></div><div role="info" class="col-md-3 col-sm-6"></div><div role="goPage" class="col-md-2 col-sm-6" style="text-align: right;"></div><div role="page" class="col-md-5 col-sm-6"></div></div>',
        labelTmpl: '<label>${label_}</label>',
        textTmpl: '<input type="text" name="${name_}" id="${id_}" class="form-control ${span_}" placeholder="${placeholder_}" value="${value_}">',
        passwordTmpl: '<input type="password" class="form-control ${class_}">',
        selectTmpl: '<select name="${name_}" id="${id_}" class="form-control ${class_}"></select>',
        optionTmpl: '<option value="${value_}" ${selected}>${text_}</option>',
        checkboxGroupTmpl: '<div class="checkbox-list" id="${id_}" name="${name_}"></div>',
        checkboxTmpl: '<label>'
        + '<input type="checkbox" id="${id_}" name="${name_}" value="${value_}">${text_}</label>',
        inlineCheckboxTmpl: '<label class="checkbox-inline">'
        + '<input type="checkbox" id="${id_}" name="${name_}" value="${value_}">${text_}</label>',
        radioGroupTmpl: '<div class="radio-list" id="${id_}" name="${name_}"></div>',
        radioTmpl: '<label>'
        + '<input type="radio" id="${id_}" name="${name_}" value="${value_}">${text_}</label>',
        inlineRadioTmpl: '<label class="radio-inline">'
        + '<input type="radio" id="${id_}" name="${name_}" value="${value_}">${text_}</label>',
        displayTmpl: '<p class="form-control-static">${text_}</p>',
        buttonTmpl: '<button type="${type_}" class="${class_}" title="${title_}" ${attribute_}>${text_}</button>',
        tableTmpl: '<table class="table table-striped table-bordered table-hover dataTable no-footer" id="${id_}_table"  aria-describedby="${id_}_info"></table>',
        alertTmpl: '<div class="alert alert-${type_} alert-dismissable" role="alert">'
        + '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
        + '<strong>提示!</strong>${alert_}</div>'
    };
    Grid.prototype = {
        reload: function (options) {
            this._reload(options);
        },
        // 获取当前选中节点id
        getSelectIds: function () {
            var ids = [];
            var checkboxs = this.$gridWrapper.find(".checkboxes:checked").each(
                function () {
                    ids.push($(this).val());
                });
            return ids;
        },
        // 获取选中节点的数据集合
        getSelectDatas: function () {
            var datas = [];
            this.$gridWrapper.find("tr.active").each(function () {
                datas.push($(this).data("data"));
            });
            return datas;
        },
        alert: function (alertText) {
            this._alert(alertText, "danger", 5);
        },
        _alert: function (alertText, type, seconds, cb) {
            if (type == undefined) {
                type = "danger";
            }
            if (seconds == undefined) {
                seconds = 3;
            }
            var alertDiv = $.tmpl(Grid.statics.alertTmpl, {
                "type_": type,
                "alert_": alertText
            });
            this.$element.prepend(alertDiv);
            alertDiv.delay(seconds * 1000).fadeOut();
            App.scrollTo(alertDiv, -200);
            if (cb != undefined) {
                cb();
            }
        },
        // 设置变量
        _setVariable: function (element, options) {
            this.$element = $(element);
            var id = element.id;
            if (id == undefined) {
                id = "davdian_grid_" + new Date().getTime();
                this.$element.attr("id", id);
            }
            this._elementId = id;
            this._options = options;

            this._grids = new Object();
            this.$searchForm = undefined;
            this.$gridWrapper = new Object();
            this._total = 0;
            // 搜索栏是否初始化
            this._searchInited = false;
            // 工具栏是否初始化
            this._toolsInited = false;

        },
        // 设置属性
        _setOptions: function (options) {
            this._autoLoad = options.autoLoad;
            this._url = options.url;
            this._type = options.type == undefined ? "GET" : options.type;
            this._beforeSend = options.beforeSend;
            if (options.data != undefined) {
                if (options.data.data != undefined
                    || options.data.total != undefined) {
                    console.error("data格式不正确，必须包含data和total");
                    return;
                }
                this._data = options.data;
                this._grids = options.data.data;
                this._total = options.data.total;
            }
            this._columns = options.columns;
            this._pageNum = options.pageNum;
            this._pageSize = options.pageSize;
            if (options.idField != undefined) {
                this._idField = options.idField;
            } else {
                console.error("idField属性未定义");
                return;
            }
            if (options.headField != undefined) {
                this._headField = options.headField;
            }
            if (options.imgField != undefined) {
                this._imgField = options.imgField;
            }
            this._contentType = options.contentType;
            this._showContentType = options.showContentType;
            this._showCheck = options.showCheckbox;
            this._checkboxWidth = options.checkboxWidth;
            this._showIndexNum = options.showIndexNum;
            this._indexNumWidth = options.indexNumWidth;
            this._indexNumText = options.indexNumText;
            this._showSearch = options.showSearch;
            this._showPaging = options.showPaging;
            this._simplePaging = options.simplePaging;
            if (options.tools != undefined) {
                // 左侧工具栏
                this._tools = options.tools;
            }
            if (options.dropdowns != undefined) {
                // 右侧下拉选项
                this._dropdowns = options.dropdowns;
            }
            if (options.search != undefined) {
                this._search = options.search;
            }
            if (options.actionColumns != undefined) {
                // 操作栏
                this._actionColumns = options.actionColumns;
            }
            if (options.actionColumnWidth != undefined) {
                // 操作栏宽度
                this._actionColumnWidth = options.actionColumnWidth;
            }
            if (options.actionColumnAlign != undefined) {
                // 操作栏宽度
                this._actionColumnAlign = options.actionColumnAlign;
            }
            // 操作栏显示文本
            this._actionColumnText = options.actionColumnText;

            this._sort = options.sort;

            this._pageSelect = options.pageSelect;
            this._afterInit = options.afterInit;

        },
        // 实例启动
        _load: function () {
            this._loadData();
        },
        // 异步加载数据
        _loadData: function () {
            var that = this;
            var parameters = "";
            if (that._url.indexOf("?") != -1) {
                parameters = "&";
            } else {
                parameters = "?";
            }
            parameters += "pageNum=" + this._pageNum;
            parameters += "&pageSize=" + this._pageSize;
            parameters += "&sort_="
                + (this._sort == undefined ? "" : this._sort);
            $.ajax({
                type: that._type,
                dataType: "json",
                data: that.$searchForm == undefined ? {} : that.$searchForm
                        .serialize(),
                beforeSend: function (request) {
                    if (that._beforeSend != undefined) {
                        that._beforeSend(request);
                    }
                },
                url: that._url + (parameters == undefined ? "" : parameters),
                success: function (data) {
                    if (data.code === 200) {
                        that._setData(data.data);
                        that._init();
                    } else if (data.code === 401) {
                        that._alert(data.message + ";请重新登录！", App.redirectLogin);
                    } else {
                        that._alert(data.message);
                    }

                },
                error: function (jqXHR, textStatus, errorMsg) {
                    alert("请求异常！");
                }
            });
        },
        _setData: function (data) {
            this._data = data;
            this._grids = data.data;
            this._total = data.total;
        },
        _initEmpty: function () {
            this._renderEles();
        },
        // 初始化
        _init: function () {
            this._remove();
            this._renderEles();
            this._regiestEvents();
            this._doAfterInit();
        },
        // 渲染元素
        _renderEles: function () {
            if (this._showSearch && !this._searchInited) {
                this._renderSearch();
                this._searchInited = true;
            }
            if (!this._toolsInited) {
                this._renderTool();
                this._toolsInited = true;
            }
            this._renderGridWrapper();
        },
        // 渲染工具栏
        _renderTool: function () {
            if (this._tools == undefined && this._dropdowns == undefined) {
                return;
            }
            var that = this;
            var toolRow = $.tmpl(Grid.statics.toolRowTmpl, {});
            this.$element.append(toolRow);

            if (this._dropdowns != undefined) {
                var dropdownBtn = $.tmpl(Grid.statics.dropdownTmpl, {
                    "text_": (this._dropdowns.text == undefined ? "更多操作"
                        : this._dropdowns.text),
                    "cls_": (this._dropdowns.cls == undefined ? "default"
                        : this._dropdowns.cls)
                });
                toolRow.find("[ele-type='tools']").append(dropdownBtn);
                dropdownBtn.after("&nbsp;");
                $.each(this._dropdowns.items, function (index, content) {
                    var li = $.tmpl(Grid.statics.liTmpl, {
                        "text_": content.text
                    });
                    if (content.icon != undefined)
                        li.find("a").prepend(
                            "<i class='" + content.icon + "'><i>");
                    dropdownBtn.find("ul").append(li);
                    li.on("click", function () {
                        content.handle(that);
                    });
                });
            }
            if (this._tools != undefined) {
                $.each(this._tools, function (index, content) {
                    var button = $.tmpl(Grid.statics.buttonTmpl, {
                        "class_": content.cls,
                        "type_": "button",
                        "text_": content.text,
                        "title_": (content.title == undefined ? content.text
                            : content.title),
                        "attribute_": (content.attribute == undefined ? ""
                            : content.attribute)
                    });
                    if (content.icon != undefined)
                        button.prepend("<i class='" + content.icon + "'><i>");
                    toolRow.find("[ele-type='tools']").append(button);
                    if (content.handle != undefined) {
                        button.on("click", function () {
                            content.handle(that);
                        });
                    }
                    button.after("&nbsp;");
                });
            }
        },
        // 渲染搜索栏
        _renderSearch: function () {
            var rowEleSpan, items, buttons, hide = false;
            if (this._search == undefined) {
                return;
            } else {
                if (this._search.items != undefined) {
                    items = this._search.items;
                } else {
                    return;
                }
                if (this._search.buttons != undefined) {
                    buttons = this._search.buttons;
                }
                var rowEleNum = this._search.rowEleNum == undefined ? 2
                    : this._search.rowEleNum;
                if (12 % rowEleNum == 0) {
                    rowEleSpan = 12 / rowEleNum;
                }
                if (this._search.hide != undefined) {
                    hide = this._search.hide;
                }
            }
            var that = this;
            var searchFormRow = $.tmpl(Grid.statics.searchRowTmpl, {});
            if (items.length > 0) {
                $
                    .each(
                        items,
                        function (index, item) {
                            var itemDiv = $.tmpl(
                                Grid.statics.searchElementTmpl, {
                                    "span_": rowEleSpan
                                }).appendTo(searchFormRow);
                            if (item.label != undefined) {
                                var label = $.tmpl(
                                    Grid.statics.labelTmpl, {
                                        "label_": item.label
                                    });
                                itemDiv.find(".form-group").append(
                                    label);
                            }
                            if (item.type == "text") {
                                var ele = $
                                    .tmpl(
                                        Grid.statics.textTmpl,
                                        {
                                            "name_": (item.name == undefined ? ""
                                                : item.name),
                                            "id_": (item.id == undefined ? ""
                                                : item.id),
                                            "placeholder_": (item.placeholder == undefined ? ""
                                                : item.placeholder),
                                            "value_": (item.value == undefined ? ""
                                                : item.value)
                                        });
                                itemDiv.find(".form-group").append(ele);
                            } else if (item.type == "select") {
                                var ele = $
                                    .tmpl(
                                        Grid.statics.selectTmpl,
                                        {
                                            "name_": (item.name == undefined ? ""
                                                : item.name),
                                            "id_": (item.id == undefined ? ""
                                                : item.id)
                                        });
                                if (item.items != undefined && item.items.length > 0) {
                                    $.each(
                                        item.items,
                                        function (index, option) {
                                            $
                                                .tmpl(
                                                    Grid.statics.optionTmpl,
                                                    {
                                                        "value_": (option.value == undefined ? ""
                                                            : option.value),
                                                        "text_": (option.text == undefined ? ""
                                                            : option.text)
                                                    })
                                                .appendTo(
                                                    ele);
                                        }
                                    );
                                }
                                itemDiv.find(".form-group").append(ele);
                                if (item.itemsUrl != undefined) {
                                    $.ajax({
                                            type: (item.method == undefined ? "GET" : item.method),
                                            dataType: "json",
                                            async: false,
                                            url: item.itemsUrl,
                                            success: function (data) {
                                                $.each(
                                                    data,
                                                    function (index,
                                                              option) {
                                                        $
                                                            .tmpl(
                                                                Grid.statics.optionTmpl,
                                                                {
                                                                    "value_": (option.value == undefined ? ""
                                                                        : option.value),
                                                                    "text_": (option.text == undefined ? ""
                                                                        : option.text)
                                                                })
                                                            .appendTo(
                                                                ele);
                                                    }
                                                );
                                                that._uniform();
                                            },
                                            error: function (err) {
                                                console
                                                    .error("请求错误");
                                            }
                                        }
                                    );
                                }
                            } else if (item.type == "radioGroup") {
                                var ele = $
                                    .tmpl(
                                        Grid.statics.radioGroupTmpl,
                                        {
                                            "name_": (item.name == undefined ? ""
                                                : item.name),
                                            "id_": (item.id == undefined ? ""
                                                : item.id)
                                        });
                                $
                                    .each(
                                        item.items,
                                        function (index, option) {
                                            $
                                                .tmpl(
                                                    Grid.statics.inlineRadioTmpl,
                                                    {
                                                        "name_": (item.name == undefined ? ""
                                                            : item.name),
                                                        "id_": (item.id == undefined ? ""
                                                            : item.id),
                                                        "value_": (option.value == undefined ? ""
                                                            : option.value),
                                                        "text_": (option.text == undefined ? ""
                                                            : option.text)
                                                    })
                                                .appendTo(
                                                    ele);
                                        });
                                itemDiv.find(".form-group").append(ele);
                                if (item.itemsUrl != undefined) {
                                    $
                                        .ajax({
                                            type: "POST",
                                            dataType: "json",
                                            async: false,
                                            url: item.itemsUrl,
                                            success: function (data) {
                                                $
                                                    .each(
                                                        data,
                                                        function (index,
                                                                  option) {
                                                            $
                                                                .tmpl(
                                                                    Grid.statics.inlineRadioTmpl,
                                                                    {
                                                                        "value_": (option.value == undefined ? ""
                                                                            : option.value),
                                                                        "text_": (option.text == undefined ? ""
                                                                            : option.text)
                                                                    })
                                                                .appendTo(
                                                                    ele);
                                                        });
                                                that._uniform();
                                            },
                                            error: function (err) {
                                                console
                                                    .error("请求错误");
                                            }
                                        });
                                }
                            } else if (item.type == "checkboxGroup") {
                                var ele = $
                                    .tmpl(
                                        Grid.statics.checkboxGroupTmpl,
                                        {
                                            "name_": (item.name == undefined ? ""
                                                : item.name),
                                            "id_": (item.id == undefined ? ""
                                                : item.id)
                                        });
                                $
                                    .each(
                                        item.items,
                                        function (index, option) {
                                            $
                                                .tmpl(
                                                    Grid.statics.inlineCheckboxTmpl,
                                                    {
                                                        "name_": (item.name == undefined ? ""
                                                            : item.name),
                                                        "id_": (item.id == undefined ? ""
                                                            : item.id),
                                                        "value_": (option.value == undefined ? ""
                                                            : option.value),
                                                        "text_": (option.text == undefined ? ""
                                                            : option.text)
                                                    })
                                                .appendTo(
                                                    ele);
                                        });
                                itemDiv.find(".form-group").append(ele);
                                if (item.itemsUrl != undefined) {
                                    $
                                        .ajax({
                                            type: "POST",
                                            dataType: "json",
                                            async: false,
                                            url: item.itemsUrl,
                                            success: function (data) {
                                                $
                                                    .each(
                                                        data,
                                                        function (index,
                                                                  option) {
                                                            $
                                                                .tmpl(
                                                                    Grid.statics.inlineCheckboxTmpl,
                                                                    {
                                                                        "value_": (option.value == undefined ? ""
                                                                            : option.value),
                                                                        "text_": (option.text == undefined ? ""
                                                                            : option.text)
                                                                    })
                                                                .appendTo(
                                                                    ele);
                                                        });
                                                that._uniform();
                                            },
                                            error: function (err) {
                                                console
                                                    .error("请求错误");
                                            }
                                        });
                                }
                            } else if (item.type == "datepicker") {
                                var dateTmpl = '<div class="input-group input-medium">'
                                    + '<input type="text" role="date-input" id="${id_}" name=${name_} value="${value_}" class="form-control">'
                                    + '<span role="icon" class="input-group-addon">'
                                    + '<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>' + '</span></div>';
                                if (typeof(moment) == "undefined") {
                                    return $.tmpl(dateTmpl, {
                                        "id_": (item.id == undefined ? item.name : item.id),
                                        "name_": item.name,
                                        "cls_": item.cls == undefined ? "" : item.cls,
                                        "value_": ""
                                    });
                                }
                                var ele = $.tmpl(dateTmpl, {
                                    "id_": (item.id == undefined ? item.name : item.id),
                                    "name_": item.name,
                                    "cls_": item.cls == undefined ? "" : item.cls,
                                    "value_": (item.value == undefined ? moment().format('YYYY-MM-DD HH:mm:ss') : item.value)
                                });
                                itemDiv.find(".form-group").append(ele);
                                var config = (item.config == undefined ? {} : item.config);
                                var option = $.extend(true, dateDefaults, config);
                                if (item.callback != undefined) {
                                    ele.find('[role="date-input"]').daterangepicker(option, item.callback);
                                } else {
                                    ele.find('[role="date-input"]').daterangepicker(option);
                                }
                                ele.find('span').on("click", function () {
                                    $(this).prev().click();
                                });
                            }
                            searchFormRow.find(".row").append(itemDiv);
                        });
            }
            searchFormRow.append("<hr>");
            if (buttons != undefined && buttons.length > 0) {
                $.each(buttons, function (index, button) {
                    var btn = $.tmpl(Grid.statics.buttonTmpl, {
                        "class_": (button.cls == undefined ? "btn btn-default"
                            : button.cls),
                        "text_": (button.text == undefined ? "未定义"
                            : button.text),
                        "title_": (button.title == undefined ? button.text
                            : button.title),
                        "type_": (button.type == undefined ? "button"
                            : button.type)
                    });
                    if (button.icon != undefined)
                        btn.prepend("<i class='" + button.icon + "'><i>");
                    if (button.handle != undefined)
                        btn.on("click", function () {
                            button.handle(that);
                        });
                    searchFormRow.find('.form-actions').append(btn);
                    btn.after("&nbsp;");
                });
            }
            if (hide) {
                showBtn = $.tmpl(Grid.statics.buttonTmpl, {
                    "class_": "btn btn-primary",
                    "text_": "显示搜索面板",
                    "title_": "显示",
                    "type_": "button"
                }).show();
                hideBtn = $.tmpl(Grid.statics.buttonTmpl, {
                    "class_": "btn btn-warning",
                    "text_": "隐藏搜索面板",
                    "title_": "隐藏",
                    "type_": "button"
                }).hide();
            } else {
                showBtn = $.tmpl(Grid.statics.buttonTmpl, {
                    "class_": "btn btn-primary",
                    "text_": "显示搜索面板",
                    "title_": "显示",
                    "type_": "button"
                }).hide();
                hideBtn = $.tmpl(Grid.statics.buttonTmpl, {
                    "class_": "btn btn-warning",
                    "text_": "隐藏搜索面板",
                    "title_": "隐藏",
                    "type_": "button"
                }).show();
            }
            searchFormRow.find('.form-actions').append(showBtn);
            searchFormRow.find('.form-actions').append(hideBtn);
            hideBtn.after("&nbsp;");
            showBtn.on("click", function () {
                searchFormRow.find('.form-body').slideDown();
                showBtn.toggle();
                hideBtn.toggle();
            });
            hideBtn.on("click", function () {
                searchFormRow.find('.form-body').slideUp();
                showBtn.toggle();
                hideBtn.toggle();
            });
            var resetbtn = $.tmpl(Grid.statics.buttonTmpl, {
                "class_": "btn btn-default",
                "text_": "重置",
                "title_": "重置",
                "type_": "reset"
            });
            searchFormRow.find('.form-actions').append(resetbtn);
            resetbtn.after("&nbsp;");

            var searchbtn = $.tmpl(Grid.statics.buttonTmpl, {
                "class_": "btn btn-primary",
                "text_": " 搜索",
                "title_": "搜索",
                "type_": "button"
            });
            searchbtn.prepend("<i class='fa fa-search'><i>");
            searchbtn.on("click", function () {
                that._reload({
                    pageNum: 1
                });
                if (that._search.submitHandle != undefined)
                    that._search.submitHandle();
            });
            searchFormRow.find('.form-actions').append(searchbtn);
            searchbtn.after("&nbsp;");
            this.$element.append(searchFormRow);
            this._uniform();
            this.$searchForm = searchFormRow.find("form[ele-type='search']");
            if (hide) {
                searchFormRow.find('.form-body').slideUp(1);
            }
        },
        _renderGridWrapper: function () {
            var that = this;
            var gridWrapper = $.tmpl(Grid.statics.gridWrapperTmpl, {
                "id_": that._elementId
            });
            this.$element.append(gridWrapper);
            this.$gridWrapper = gridWrapper;
            var contentTypeBtn = $('<div class="row"><div class="col-lg-12">' +
                '<div id="tab" class="btn-group pull-right">' +
                '<a role="table" class="btn btn-large btn-info" title="表格" ><i class="fa fa-table"></i></a>' +
                '<a role="card" class="btn btn-large btn-info" title="卡片"><i class="fa fa-th"></i></a>' +
                '<a role="list" class="btn btn-large btn-info" title="列表"><i class="fa fa-list"></i></a>' +
                '</div>' +
                '</div></div>');
            if (this._showContentType) {
                gridWrapper.append(contentTypeBtn);
            }
            this.$contentTypeBtn = contentTypeBtn;
            if (this._contentType === "table") {
                this.$contentTypeBtn.find("a[role=table]").addClass("active");
                this.$contentTypeBtn.find("a[role=card]").removeClass("active");
                this.$contentTypeBtn.find("a[role=list]").removeClass("active");
                this._renderTable();
            } else if (this._contentType === "card") {
                this.$contentTypeBtn.find("a[role=table]").removeClass("active");
                this.$contentTypeBtn.find("a[role=card]").addClass("active");
                this.$contentTypeBtn.find("a[role=list]").removeClass("active");
                this._renderCard();
            } else if (this._contentType === "list") {
                this.$contentTypeBtn.find("a[role=table]").removeClass("active");
                this.$contentTypeBtn.find("a[role=card]").removeClass("active");
                this.$contentTypeBtn.find("a[role=list]").addClass("active");
                this._renderList();
            }
            if (this._showPaging) {
                this._renderPaging();
            }
            this.$contentTypeBtn.find("a").off("click");
            this.$contentTypeBtn.find("a").on("click", function () {
                var role = $(this).attr("role");
                that._reload({
                    contentType: role
                });
            });
        },
        _renderList: function () {
            var that = this;
            var head_array = [];
            var head_index = [];
            var format_array = [];
            $.each(that._columns, function (index, column) {
                head_array.push(column.field);
                head_index.push(index);
                format_array.push(column.format);
            });
            var listRow = $.tmpl(Grid.statics.listRowTmpl, {});
            var div = $('<div class="catlist"></div>');
            if (that._grids != undefined && that._grids != null) {
                if (that._grids.length == 0) {
                    div.append('<dl><dd><p style="text-align: center;">暂无数据!</p></dd></dl>');
                }
            }
            $.each(that._grids, function (i, grid) {
                var num = (that._pageNum - 1) * that._pageSize + i + 1;
                var ele = $('<dl>' +
                    '<dt>' +
                    '<img role="img" src="../../cdn/img/128.png" alt="Product image" width="128" height="128" />' +
                    '<strong><span role="cb"></span></strong>' +
                    '<a href="javacript:void(0);" role="hd"></a>' +
                    '</dt>' +
                    '<dd role="data">' +
                    '</dd>' +
                    '<dd><div class="pull-right" role="btn-g"></div>' +
                    '</dd>' +
                    '</dl>');
                if (that._showCheck) {
                    var checkbox = $('<input type="checkbox" class="checkboxes" style="height: 18px;" value="'
                        + grid[that._idField] + '"/>');
                    ele.find("span[role=cb]").append(checkbox);
                }
                $.each(that._columns, function (j, column) {
                    var title = column.title;
                    var field = column.field;
                    var html = grid[field];
                    if (column.format != undefined) {
                        html = column.format(num, grid);
                    }
                    if (that._headField == undefined) {
                        ele.find("a[role=hd]").text(title + ':' + grid[that._idField]);
                    }
                    if (that._imgField != undefined && that._imgField != null && grid[that._imgField] != undefined) {
                        ele.find("img[role=img]").attr("src", grid[that._imgField]);
                    }
                    if (column.field == that._headField) {
                        ele.find("a[role=hd]").text(title + ':' + html);
                    }
                    if (column.field != that._imgField && column.field != that._headField) {
                        var p = $('<p><label>' + title + '</label>  ' + html + '</p>');
                        ele.find("dd[role=data]").append(p);
                    }
                });
                if (that._actionColumns != undefined) {
                    var _index = i;
                    var current_data = grid;
                    $.each(that._actionColumns, function (k, colum) {
                        var visible = true;
                        if (colum.visible != undefined) {
                            visible = colum.visible(_index, current_data);
                        }
                        if (visible == false) {
                            return;
                        }
                        var text = colum.text;
                        if (colum.textHandle != undefined) {
                            text = colum.textHandle(num, current_data);
                        }
                        if (colum.clsHandle != undefined) {
                            colum.cls = colum.clsHandle(num, current_data);
                        }
                        var button = $('<button type="button" class="btn ' + colum.cls + '">' + text + '</button>');
                        if (colum.handle != undefined) {
                            button.click(function (e) {
                                colum.handle(num, current_data);
                                e.stopPropagation();
                            });
                        }
                        ele.find("div[role=btn-g]").append(button);
                    });
                }
                div.append(ele);
            });
            listRow.append(div);
            this.$gridWrapper.append(listRow);
        },
        _renderCard: function () {
            var that = this;
            var head_array = [];
            var head_index = [];
            var format_array = [];
            $.each(that._columns, function (index, column) {
                head_array.push(column.field);
                head_index.push(index);
                format_array.push(column.format);
            });
            var cardRow = $.tmpl(Grid.statics.cardRowTmpl, {});
            if (that._grids != undefined && that._grids != null) {
                if (that._grids.length == 0) {
                    var emptyRow = $('<div class="row"></div>');
                    emptyRow.append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div style="text-align: center;" class="thumbnail">暂无数据!</div></div>');
                    cardRow.append(emptyRow);
                } else {
                    var row = {};
                    $.each(that._grids, function (i, grid) {
                        var num = (that._pageNum - 1) * that._pageSize + i + 1;
                        if ((i + 1) % 3 == 1) {
                            row = $('<div class="row"></div>');
                            cardRow.append(row);
                        }
                        var ele = $('<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
                            '<div class="thumbnail">' +
                            '<div class="caption">' +
                            '<div class="col-lg-12">' +
                            '<span class="puu-left">' + num + '</span>' +
                            '<span class="pull-right" role="cb"></span>' +
                            '</div>' +
                            '<div class="col-lg-12 well well-add-card">' +
                            '<h4 role="hd"></h4>' +
                            '</div>' +
                            '<div role="data" class="col-lg-12">' +
                            '</div>' +
                            '<div role="btn-g">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>');
                        if (that._showCheck) {
                            var checkbox = $('<input type="checkbox" class="checkboxes" style="height: 18px;" value="'
                                + grid[that._idField] + '"/>');
                            ele.find("span[role=cb]").append(checkbox);
                        }
                        $.each(that._columns, function (j, column) {
                            var title = column.title;
                            var field = column.field;
                            var html = grid[field];
                            if (column.format != undefined) {
                                html = column.format(num, grid);
                            }
                            if (that._headField == undefined) {
                                ele.find("h4[role=hd]").text(grid[that._idField]);
                            }
                            if (column.field == that._headField) {
                                ele.find("h4[role=hd]").text(html);
                            }
                            var p = $('<div><label>' + title + '</label>  ' + html + '</div>');
                            ele.find("div[role=data]").append(p);
                        });
                        if (that._actionColumns != undefined) {
                            var _index = i;
                            var current_data = grid;
                            $.each(that._actionColumns, function (k, colum) {
                                var visible = true;
                                if (colum.visible != undefined) {
                                    visible = colum.visible(_index, current_data);
                                }
                                if (visible == false) {
                                    return;
                                }
                                var text = colum.text;
                                if (colum.textHandle != undefined) {
                                    text = colum.textHandle(num, current_data);
                                }
                                if (colum.clsHandle != undefined) {
                                    colum.cls = colum.clsHandle(num, current_data);
                                }
                                var button = $('<button type="button" class="btn btn-update btn-add-card ' + colum.cls + '">' + text + '</button>');
                                if (colum.handle != undefined) {
                                    button.click(function (e) {
                                        colum.handle(num, current_data);
                                        e.stopPropagation();
                                    });
                                }
                                ele.find("div[role=btn-g]").append(button);
                            });
                        }
                        row.append(ele);
                    });
                }
            }
            this.$gridWrapper.append(cardRow);
        },
        // 渲染表格
        _renderTable: function () {
            var that = this;
            var head_array = [];
            var head_index = [];
            var format_array = [];
            $.each(that._columns, function (index, column) {
                head_array.push(column.field);
                head_index.push(index);
                format_array.push(column.format);
            });

            var colTmpl = '<col width="${width_}"></col>';
            var trTmpl = '<tr role="row" class="${class_}"></tr>';
            var thTmpl = '<th class="${class_} ${sorting_}" rowspan="1" colspan="1" style="${style_}"></th>';
            var tdTmpl = '<td class="${class_}" style="vertical-align: middle;"></td>';

            var tableRow = $.tmpl(Grid.statics.tableRowTmpl, {});

            var table = $.tmpl(Grid.statics.tableTmpl, {
                "id_": that._elementId
            });
            // colgrop
            var cols = function (width) {
                return $.tmpl(colTmpl, {
                    "width_": width
                });
            };
            var renderColgroup = function (colgroup) {
                if (that._showCheck == true) {
                    colgroup.append(cols(that._checkboxWidth));
                }
                if (that._showIndexNum == true) {
                    colgroup.append(cols(that._indexNumWidth));
                }
                $.each(that._columns, function (index, column) {
                    colgroup.append(cols(column.width == undefined ? ""
                        : column.width));
                });
                if (that._actionColumns != undefined) {
                    colgroup.append(cols(that._actionColumnWidth));
                }
            };
            var colgroup = $('<colgroup></colgroup>');
            renderColgroup(colgroup);
            table.append(colgroup);

            // thead
            var renderThead = function (thead) {
                var sortField, sortMode;
                if (that._sort != undefined) {
                    if (that._sort.indexOf("_desc") != -1) {
                        sortField = that._sort.replace("_desc", "");
                        sortMode = "desc";
                    } else if (that._sort.indexOf("_asc") != -1) {
                        sortField = that._sort.replace("_asc", "");
                        sortMode = "asc";
                    }
                }
                var tr = $.tmpl(trTmpl, {});
                if (that._showCheck) {
                    var checkboxTh = $.tmpl(thTmpl, {
                        "class_": "table-checkbox",
                        "sorting_": "sorting_disabled"
                    });
                    var checkbox = $('<input type="checkbox" class="group-checkable" data-set="#'
                        + that._elementId + ' .checkboxes"/>');
                    checkboxTh.append(checkbox);
                    tr.append(checkboxTh);
                }
                if (that._showIndexNum) {
                    var indexTh = $.tmpl(thTmpl, {
                        "sorting_": "sorting_disabled"
                    });
                    indexTh.html(that._indexNumText);
                    tr.append(indexTh);
                }
                $.each(that._columns, function (index, column) {
                    var style = "";
                    var sort = "sorting_disabled";
                    if (column.align != undefined) {
                        style += "text-align:" + column.align + ";";
                    }
                    if (column.sort != undefined && column.sort) {
                        sort = "sorting";
                        if (sortField == column.field) {
                            sort = "sorting_" + sortMode;
                        }
                    }
                    var th = $.tmpl(thTmpl, {
                        "style_": style,
                        "sorting_": sort
                    });
                    th.text(column.title == undefined ? "未定义" : column.title);
                    th.data("field", column.field);
                    tr.append(th);
                });
                var actionStyle = "";
                if (that._actionColumns != undefined) {
                    if (that._actionColumnAlign != undefined) {
                        actionStyle += "text-align:" + that._actionColumnAlign
                            + ";";
                    }
                    var actionTh = $.tmpl(thTmpl, {
                        "style_": actionStyle
                    });
                    actionTh.text(that._actionColumnText);
                    tr.append(actionTh);
                }
                thead.append(tr);
            };
            var thead = $('<thead></thead>');
            renderThead(thead);
            table.append(thead);

            // tbody
            var renderTbody = function (tbody, grid, index) {
                var num = (that._pageNum - 1) * that._pageSize + index + 1;
                var tr = $.tmpl(trTmpl, {
                    "class_": "odd gradeX"
                });
                if (that._showCheck == true) {
                    var checkboxTd = $.tmpl(tdTmpl, {});
                    var checkbox = $('<input type="checkbox" class="checkboxes" value="'
                        + grid[that._idField] + '"/>');
                    checkboxTd.append(checkbox);
                    tr.append(checkboxTd);
                }
                if (that._showIndexNum == true) {
                    var indexTd = $.tmpl(tdTmpl, {});
                    indexTd.html(num);
                    tr.append(indexTd);
                }
                $.each(that._columns, function (index, column) {
                    var td = $.tmpl(tdTmpl, {});
                    var html = grid[column.field];
                    if (column.format != undefined) {
                        html = column.format(num, grid);
                    } else {
                        td.attr("title", html);
                    }
                    td.html(html);
                    tr.append(td);
                });
                if (that._actionColumns != undefined) {
                    var cltd = $.tmpl(tdTmpl, {});
                    var _index = index;
                    var current_data = grid;
                    $.each(that._actionColumns, function (index, colum) {
                        var visible = true;
                        if (colum.visible != undefined) {
                            visible = colum.visible(_index, current_data);
                        }
                        if (visible == false) {
                            return;
                        }
                        var text = colum.text;
                        if (colum.textHandle != undefined) {
                            text = colum.textHandle(num, current_data);
                        }
                        if (colum.clsHandle != undefined) {
                            colum.cls = colum.clsHandle(num, current_data);
                        }
                        var button = $.tmpl(Grid.statics.buttonTmpl, {
                            "class_": "btn " + colum.cls,
                            "text_": text,
                            "title_": (colum.title == undefined ? text
                                : colum.title)
                        });
                        if (colum.handle != undefined) {
                            button.click(function (e) {
                                colum.handle(num, current_data);
                                e.stopPropagation();
                            });
                        }
                        cltd.append(button);
                    });
                }
                tr.append(cltd);
                tbody.append(tr);
                tr.data("data", grid);
            };
            var renderEmptyTbody = function (tbody) {
                var tr = $.tmpl(trTmpl, {
                    "class_": "odd gradeX"
                });
                var cols = that._columns.length + (that._showCheck == true ? 1 : 0) + (that._showIndexNum ? 1 : 0) + (that._actionColumns ? that._actionColumns.length : 0);
                var td = $.tmpl(tdTmpl, {});
                td.css("text-align", "center");
                td.attr("colspan", cols);
                td.html("没有数据！");
                tr.append(td);
                tbody.append(tr);
            };
            var renderLoadingTbody = function (tbody) {
                var tr = $.tmpl(trTmpl, {
                    "class_": "odd gradeX"
                });
                var cols = that._columns.length + (that._showCheck == true ? 1 : 0) + (that._showIndexNum ? 1 : 0) + (that._actionColumns ? that._actionColumns.length : 0);
                var td = $.tmpl(tdTmpl, {});
                td.css("text-align", "center");
                td.attr("colspan", cols);
                td.html("加载中...");
                tr.append(td);
                tbody.append(tr);
            };
            var tbody = $('<tbody></tbody>');
            if (that._grids != undefined && that._grids != null) {
                if (that._grids.length == 0)
                    renderEmptyTbody(tbody);
                $.each(that._grids, function (index, grid) {
                    renderTbody(tbody, grid, index);
                });
            } else {
                renderLoadingTbody(tbody);
            }
            table.append(tbody);
            tableRow.append(table);
            this.$gridWrapper.append(tableRow);
        },
        // 渲染分页
        _renderPaging: function () {
            var that = this;
            var pagingRow = $.tmpl(Grid.statics.pagingRowTmpl, {});
            // select

            var select = $('<div class="dataTables_length"><label><select id="'
                + this._elementId
                + '_length" class="form-control input-xsmall input-inline"></select></label></div>');

            var options = this._pageSelect;
            if (options.indexOf(that._pageSize) == -1) {
                options.push(that._pageSize);
            }
            options.sort(function (a, b) {
                return a > b ? 1 : -1;
            });
            for (var i in options) {
                var option = $.tmpl(Grid.statics.optionTmpl, {
                    "value_": options[i],
                    "text_": options[i],
                    "selected": that._pageSize == options[i] ? "selected" : ""
                });
                select.find("select").append(option);
            }
            if (!this._simplePaging)
                pagingRow.find("[role='select']").append(select);
            // info
            var info = $('<div class="dataTables_info" id="' + this._elementId
                + '_info" role="status" aria-live="polite"></div>');
            var text = "<label style='font-size: initial;'>当前 "
                + (this._total == 0 ? "0" : ((this._pageNum - 1)
                    * this._pageSize + 1))
                + " 到 "
                + ((this._pageNum * this._pageSize) > this._total ? this._total
                    : (this._pageNum * this._pageSize)) + " 共 "
                + this._total + "</label>";
            info.html(text);
            if (!this._simplePaging)
                pagingRow.find("[role='info']").append(info);

            // page
            var liTmpl = '<li class="${class_}" aria-controls="${pageto_}" id="${id_}" tabindex="0"><a style="${style_}" href="javascript:;">${num_}</a></li>';
            var renderPageEle = function (ul, pageNum, totalP) {
                var firstLi = $.tmpl(liTmpl, {
                    "class_": pageNum == 1 ? "prev disabled" : "prev",
                    "pageto_": 1,
                    "num_": "首页"
                });
                ul.append(firstLi);
                if (totalP <= 5 && totalP > 0) {
                    for (var i = 1; i <= totalP; i++) {
                        var li = $.tmpl(liTmpl, {
                            "class_": pageNum == i ? "paginate_button active"
                                : "paginate_button",
                            "id_": "",
                            "pageto_": i,
                            "num_": i
                        });
                        ul.append(li);
                    }
                } else if (totalP > 5) {
                    if (pageNum <= 3) {
                        for (var i = 1; i <= 5; i++) {
                            var li = $
                                .tmpl(
                                    liTmpl,
                                    {
                                        "class_": pageNum == i ? "paginate_button active"
                                            : "paginate_button",
                                        "id_": "",
                                        "pageto_": i,
                                        "num_": i
                                    });
                            ul.append(li);
                        }
                    } else if (pageNum > 3 && pageNum < (totalP - 2)) {
                        for (var i = pageNum - 2; i <= pageNum + 2; i++) {
                            var li = $
                                .tmpl(
                                    liTmpl,
                                    {
                                        "class_": pageNum == i ? "paginate_button active"
                                            : "paginate_button",
                                        "id_": "",
                                        "pageto_": i,
                                        "num_": i
                                    });
                            ul.append(li);
                        }
                    } else {
                        for (var i = totalP - 4; i <= totalP; i++) {
                            var li = $
                                .tmpl(
                                    liTmpl,
                                    {
                                        "class_": pageNum == i ? "paginate_button active"
                                            : "paginate_button",
                                        "id_": "",
                                        "pageto_": i,
                                        "num_": i
                                    });
                            ul.append(li);
                        }
                    }
                }
                var lastLi = $.tmpl(liTmpl, {
                    "class_": ((pageNum == totalP) || (totalP == 0)) ? "next disabled" : "next",
                    "pageto_": totalP,
                    "num_": "尾页"
                });
                ul.append(lastLi);
            };
            var page = $('<div class="dataTables_paginate" id="'
                + this._elementId + '_paginate"></div>');
            var ul = $('<ul class="pagination" style="visibility: visible;"></ul>');
            page.append(ul);
            var totalP = this._getTotalPage();
            renderPageEle(ul, this._pageNum, totalP);
            pagingRow.find("[role='page']").append(page);
            var goPage = $('<div class="dataTables_paginate input-group">'
                + '			<input type="text" id="goInput" class="form-control input-xs input-inline" style="width: 112px;" placeholder="输入跳转页...">'
                + '			<span class="input-group-btn">'
                + '			<button class="btn btn-primary" id="goBtn" type="button">跳转</button>'
                + '			</span>'
                + '		</div>');
            if (!this._simplePaging)
                pagingRow.find("[role='goPage']").append(goPage);
            this.$gridWrapper.append(pagingRow);
        },
        _getTotalPage: function () {
            var totalP = 0;
            var totalcount = this._total;
            var pagesize = this._pageSize;
            if (totalcount % pagesize != 0) {
                totalP = Math.floor(totalcount / pagesize) + 1;
            } else {
                totalP = Math.floor(totalcount / pagesize);
            }
            return totalP;
        },
        // 注册事件
        _regiestEvents: function () {
            var that = this;
            // checkbox相关
            this.$gridWrapper.find('.group-checkable').change(
                function () {
                    var set = $(this).attr("data-set");
                    var checked = $(this).is(":checked");
                    $(set)
                        .each(
                            function () {
                                if (checked) {
                                    $(this).prop("checked", true);
                                    $(this).parent().parent()
                                        .addClass("active");
                                } else {
                                    $(this).prop("checked", false);
                                    $(this).parent().parent()
                                        .removeClass("active");
                                }
                            });
                });
            this.$gridWrapper.find(".checkboxes").change(
                function () {
                    var checked = $(this).is(":checked");
                    if (checked) {
                        $(this).parent().parent()
                            .addClass("active");
                    } else {
                        $(this).parent().parent()
                            .removeClass("active");
                    }
                });
            // 分页相关
            this.$gridWrapper.find('ul.pagination li').not(".disabled").on(
                "click", function () {
                    var pN = $(this).attr("aria-controls");
                    if (parseFloat(pN)) {
                        that._reload({
                            pageNum: parseFloat(pN)
                        });
                    }
                });
            this.$gridWrapper.find('.dataTables_length select').on("change",
                function () {
                    var pS = $(this).val();
                    if (parseFloat(pS)) {
                        that._reload({
                            pageNum: 1,
                            pageSize: parseFloat(pS)
                        });
                    }
                });
            // 跳转相关
            this.$gridWrapper.find("#goInput").val(this._pageNum);
            this.$gridWrapper.find("#goBtn").on(
                "click",
                function () {
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    if (reg.test($("#goInput").val())
                        && $("#goInput").val() <= that._getTotalPage()) {
                        that._reload({
                            pageNum: $("#goInput").val()
                        });
                    } else {
                        alert("错误的页码");
                    }
                });
            // 排序相关
            this.$gridWrapper.find('th.sorting').on("click", function () {
                var field = $(this).data("field");
                that._reload({
                    sort: field + "_asc"
                });
            });
            this.$gridWrapper.find('th.sorting_asc').on("click", function () {
                var field = $(this).data("field");
                that._reload({
                    sort: field + "_desc"
                });
            });
            this.$gridWrapper.find('th.sorting_desc').on("click", function () {
                var field = $(this).data("field");
                that._reload({
                    sort: field + "_asc"
                });
            });
            this._uniform();
        },
        // 执行回调
        _doAfterInit: function () {
            if (this._afterInit != undefined)
                this._afterInit();
        },
        _uniform: function () {
            if (!$().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle)");
            if (test.size() > 0) {
                test.each(function () {
                    $(this).show();
                    $(this).uniform();
                });
            }
        },
        // 销毁
        _remove: function () {
            if (this.$gridWrapper.remove != undefined) {
                this.$gridWrapper.remove();
            }
        },
        // 重新加载
        _reload: function (options) {
            if (options != undefined) {
                this._options = $.extend(true, {}, this._options, options);
                this._setOptions(this._options, this);
            }
            this._load();
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */
    /**
     * 解决ieindexOf问题
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this && this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    var grid = function (options, callback) {
        if (callback != undefined) {
            options.afterInit = callback;
        }
        options = $.extend(true, {}, Grid.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new Grid(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangeGrid': grid
    });
})(jQuery, window, document);
