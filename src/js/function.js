/**
 * Created by chenguojun on 9/28/16.
 */

(function ($, window, document, undefined) {
    App.menu = {
        "initVerticalMenu": initVerticalMenu,
        "initSideMenu": initSideMenu,
        "toggleMenu": toggleMenu
    };
    App.menusMapping = {};
    function toggleMenu() {
        var toggle = $.cookie('menu-toggle');
        if (toggle === undefined) {
            toggle = "v";
        }
        if (toggle == "v") {
            $.cookie('menu-toggle', "s", {expires: 7, path: '/'});
        } else {
            $.cookie('menu-toggle', "v", {expires: 7, path: '/'});
        }

    }

    function getSubMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.id == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getTopMenu(menus) {
        var topMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId === 0) {
                topMenus.push(m);
            } else {
                var subMenus = getMenu(menus, m.parentId);
                if (subMenus.length === 0) {
                    topMenus.push(m);
                }
            }
        });
        return topMenus;
    }

    function secondMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='nav nav-second-level collapse'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                + '<a data-url="' + m.action
                + '" data-title="' + m.functionName
                + '" href="javascript:void(0);"><i class="' + (m.icon === null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                + m.functionName
                + '</a>');
                var sMenus = getSubMenu(menus, m.id);
                ele = thirdMenu(ele, sMenus);
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function secondVerticalMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='dropdown-menu animated flipInX'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                + '<a data-url="' + m.action
                + '" data-title="' + m.functionName
                + '" href="javascript:void(0);"><i class="' + (m.icon === null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                + m.functionName
                + '</a>');
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function thirdMenu(ele, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='nav nav-third-level collapse'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                + '<a data-url="' + m.action
                + '" data-title="' + m.functionName
                + '" href="javascript:void(0);"><i class="' + (m.icon === null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                + m.functionName
                + '</a>');
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function initSideMenu() {
        var ul = "#side-menu";
        $("ul[role=vertical]").remove();
        $(".page-wrapper").removeClass("side-page");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", App.token);
                },
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data;
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId === 0) {
                                var ele =
                                    '<li data-level="top">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);"><i class="' + (m.icon === null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                                    + m.functionName
                                    + '</a>';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    ele = secondMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                li.find("li[data-level=sub]").parents("li[data-level=top]").addClass("submenu").find("a:eq(0)").append('<span class="caret pull-right"></span>');
                                $(ul).append(li);
                            }
                        });
                        $(ul).metisMenu();
                        $(ul).find("li[class!=submenu] > a")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    var f = App.requestMapping[url];
                                    if (f !== undefined) {
                                        $(this).on("click", function () {
                                            window.location.href = App.href + '/index.html?u=' + url;
                                        });
                                    }
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    function initVerticalMenu() {
        var ul = "#vertical-menu";
        $("ul[role=side]").remove();
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", App.token);
                },
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data;
                        var topMenus = getTopMenu(menus);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        $.each(topMenus, function (i, m) {
                            if (m.parentId === 0) {
                                var subMenus = getSubMenu(menus, m.id);
                                var dropDown = "";
                                var toggle = "";
                                var cart = "";
                                if (subMenus.length > 0) {
                                    dropDown = 'class="dropdown"';
                                    toggle = 'class="dropdown-toggle" data-toggle="dropdown"';
                                    cart = '<span class="caret"></span>';
                                }
                                var ele =
                                    '<li ' + dropDown + ' data-level="top">'
                                    + '<a data-url="' + m.action
                                    + toggle + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);"> '
                                    + m.functionName
                                    + cart
                                    + '</a>';
                                if (subMenus.length > 0) {
                                    ele = secondVerticalMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        $(ul).find("li[class!=dropdown] > a")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    var f = App.requestMapping[url];
                                    if (f !== undefined) {
                                        $(this).on("click", function () {
                                            window.location.href = App.href + '/index.html?u=' + url;
                                        });
                                    }
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    var refreshHref = function (ul) {
        var location = window.location.href;
        var url = location.substring(location.lastIndexOf("?u=") + 3);
        if (location.lastIndexOf("?u=") > 0 && url !== undefined && $.trim(url) != "") {
            var title = App.menusMapping[url];
            var f = App.requestMapping[url];
            if (f !== undefined) {
                App[f].page(title);
                var a;
                if (App.toggle == undefined || App.toggle == "v") {
                    a = $(ul).find("li[class!=dropdown] > a[data-url='" + url + "']");
                    a.parent().siblings("li").removeClass("active");
                    a.parent().parent().parent().siblings("li").removeClass("active");
                    a.parent().addClass("active");
                    a.parent().parent().parent().addClass("active");
                } else {
                    a = $(ul).find("li[class!=submenu] > a[data-url='" + url + "']");
                    a.addClass("active");
                    a.parent().parent().removeClass("collapse").addClass("in");
                }
            }
        } else {
            window.location.href = App.href + "/index.html?u=/api/index";
        }

    };
    $(document).ready(function () {
        $("#side-vertical").click(function () {
            App.menu.toggleMenu();
            window.location.reload();
        });
        var toggle = App.toggle = $.cookie('menu-toggle');
        if (toggle === undefined) {
            toggle = "v";
        }
        if (toggle == "v") {
            App.menu.initVerticalMenu();
        } else {
            App.menu.initSideMenu();
        }
    });
})(jQuery, window, document);
