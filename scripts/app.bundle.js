APP_CONST = {
    'DATA_PATH': 'data',
    'API_BOARD': 'data/board.json',
    'API_LISTS': 'data/lists.json',
    'API_USER': 'data/user.json'
};;

/**
 * The utils object
 */
var utils = (function(global, doc, $) {
    'use strict';
    var utils = {};

    /**
     * Loads given partial template and return it as string with data filled
     *
     * @param template
     * @param data
     * @return {*}
     */
    utils.loadTemplate = function(templateName, data) {
        var template_str = $('script#' + templateName + '_view').html(),
            template = _.template(template_str, { 'imports': { 'jq': $ } });
        return template(data);
    };

    /**
     * Extends(inherits) class b from d
     *
     * @param d
     * @param b
     * @private
     */
    utils.__extends = function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        __.prototype = b.prototype;
        d.prototype = new __();
    };

    /**
     * To get the class name from a given string
     *
     * @param str
     * @return {Object}
     */
    utils.str2ClassName = function(str) {
        var retStr = "", strArr = str.split('_'), i = 0;
        for(i = 0; i < strArr.length; i++) {
            retStr += strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
        }

        return retStr;
    };

    /**
     * To get the class from a given string as name of the class
     *
     * @param str
     * @return {Object}
     */
    utils.str2Class = function(str) {
        var className = this.str2ClassName(str);
        if(!global.hasOwnProperty(className)) {
            throw new Error("Class " + className + " does not exists!");
        }
        return eval(className);
    };

    return utils;

})(window, document, jQuery);
;

;

;

;

var Provider = Provider || {};

/**
 * Class Service
 */
Provider.Service = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Service() {
        this.CLASS_NAME = 'Service';
        this.cache = {};
    }

    Service.prototype.getBoardDetail = function(boardId) {
        var boardDetail = {}, toRet = {};
        if(this.cache['boardDetail-boardId-' + boardId] != null) {
            boardDetail = this.cache['boardDetail-boardId-' + boardId];
        }
        else {
            $.ajax({
                type: 'GET',
                url: APP_CONST.API_BOARD,
                dataType: 'json',
                async: false,
                success: function (data) {
                    boardDetail = data;
                },
                error: function (response) {
                    console.log(response);
                }
            });
            this.cache['boardDetail-boardId-' + boardId] = boardDetail;
        }
        toRet = _.find(boardDetail, function(e) {
            return e.id === boardId;
        });

        return toRet;
    };

    Service.prototype.getBoardLists = function(boardId) {
        var boardLists = {}, toRet = {};
        if(this.cache['boardLists-boardId-' + boardId] != null) {
            boardLists = this.cache['boardLists-boardId-' + boardId];
        }
        else {
            $.ajax({
                type: 'GET',
                url: APP_CONST.API_LISTS,
                dataType: 'json',
                async: false,
                success: function (data) {
                    boardLists = data;
                },
                error: function (response) {
                    console.log(response);
                }
            });
            this.cache['boardLists-boardId-' + boardId] = boardLists;
        }
        toRet = _.filter(boardLists, function(e) {
            return e.boardId === boardId;
        });

        return toRet;
    };

    Service.prototype.getCards = function(listId) {
        var boardLists = {}, toRet = {};
        if (this.cache['boardLists-listId-' + listId] != null) {
            boardLists = this.cache['boardLists-listId-' + listId];
        }
        else {
            $.ajax({
                type: 'GET',
                url: APP_CONST.API_LISTS,
                dataType: 'json',
                async: false,
                success: function (data) {
                    boardLists = data;
                },
                error: function (response) {
                    console.log(response);
                }
            });
            this.cache['boardLists-listId-' + listId] = boardLists;
        }
        toRet = _.find(boardLists, function(e) {
            return e.id === listId;
        });

        return toRet.cards;
    };

    Service.prototype.getMenuActivities = function() {
        return {};
    };

    return Service;

})(window, document, jQuery);;

/**
 * Class Board
 */
var Board = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Board() {
        this.CLASS_NAME = 'Board';
        this.container = '#board_container';
        this.template = 'board';
        this.list = new List();
        this.boardId = 1;
    }

    Board.prototype.bindEvents = function() {

    };

    Board.prototype.buildUi = function() {
        var that = this, cardLists = [];

        this.boardData = app.service.getBoardDetail(this.boardId);
        this.listsData = app.service.getBoardLists(this.boardId);

        $(this.container).html(utils.loadTemplate(that.template, {
            'board_title': that.boardData.name
        }));
        $.each(this.listsData, function(i, e) {
            that.list.buildUi(e);
        });

        this.bindEvents();
    };

    /**
     * The init method of the class
     */
    Board.prototype.init = function(boardId) {
        this.boardId = (boardId != null) ? boardId : this.boardId;
        app.boardId = this.boardId;
        this.buildUi();
        this.bindEvents();
    };

    return Board;

})(window, document, jQuery);;

;

var List = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function List() {
        this.CLASS_NAME = 'List';
        this.template = 'card_list';
        this.beforeElement = '.new-list';
        this.data = null;
    }

    List.prototype.bindEvents = function() {
    };

    List.prototype.buildUi = function(data) {
        var that = this;
        if(data != null) {
            this.data = data;
        }
        if(this.data == null) {
            throw new Error('Cannot build ui for null list');
        }

        if(this.data.cards == null)
            this.data.cards = app.service.getCards(this.data.id);
        $(this.beforeElement).before(
            utils.loadTemplate(that.template, {
                'list_header': that.data.name,
                'cards': that.data.cards
            })
        );
    };

    List.prototype.add = function() {
    };

    List.prototype.rename = function() {
    };

    List.prototype.archive = function() {
    };

    /**
     * The init method of the class
     */
    List.prototype.init = function(data) {
        if(data == null) {
            throw new Error('List cannot be initialized null');
        }
        this.data = data;
        this.buildUi();
        this.bindEvents();
    };

    return List;

})(window, document, jQuery);;

/**
 * Class Menu
 */
var Menu = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Menu() {
        this.CLASS_NAME = 'Menu';
        this.container = '#menu_container';
        this.template = 'menu';
        this.showMenuBtn = '#show_activity_menu';
        this.hideMenuBtn = '#hide_activity_menu';
        this.menuInnerContainer = '#activity_menu_container';
    }

    /**
     * Bind events
     */
    Menu.prototype.bindEvents = function() {
        var that = this;

        $(this.showMenuBtn).click(function() {
            setTimeout(function() {
                $(that.hideMenuBtn).show();
            }, 700);
            $(that.menuInnerContainer).show("slide", { direction: "right" }, 600);
        });
        $(this.hideMenuBtn).click(function() {
            $(this).hide();
            $(that.menuInnerContainer).hide("slide", { direction: "right" }, 600);
        });
    };

    /**
     * Loads the template and builds the UI of Menu
     */
    Menu.prototype.buildUi = function() {
        var that = this;

        this.menuActivities = app.service.getMenuActivities(app.boardId);

        $(this.container).html(utils.loadTemplate(that.template, {
            'activities': that.menuActivities
        }));

        this.bindEvents();
    };

    /**
     * The init method of the class
     */
    Menu.prototype.init = function() {
        this.buildUi();
        this.bindEvents();
    };

    return Menu;

})(window, document, jQuery);;

/**
 * The app object
 */
var app = (function(global, doc, $) {
    'use strict';
    var app = {
        'boardId': 1,
        'service': new Provider.Service()
    };

    /**
     * Resize all method for ui to bind on window resize.
     */
    app.resizeAll = function() {
        $('body').css({
            'height': $(window).height(),
            'width': '100%'
        });
        $('#body').css({
            'height': (parseInt($(window).height()) - 40) + 'px'
        });
        $('#activity_menu_container').css({
            'height': (parseInt($(window).height()) - 40) + 'px'
        });
        $('#lists_container').css({
            'height': (parseInt($(window).height()) - 105) + 'px'
        });
        $('.cards-container').css({
            'max-height': parseInt($('#lists_container').css('height')) -
            ( parseInt($('.list-header:first').css('height'))
            + parseInt($('.list-footer:first').css('height')) + 60 ) + 'px'
        });
    };

    /**
     * Returns the hash from url
     *
     * @return {string}
     */
    app.getHash = function() {
        return global.location.hash.replace('#', "");
    };

    /**
     * Updates the hash in url
     *
     * @param hash
     */
    app.updateHash = function(hash) {
        global.location.hash = '#' + hash;
    };

    /**
     * The init method of the application
     */
    app.init = function(simId) {
        this.board = new Board();
        this.board.init();
        this.menu = new Menu();
        this.menu.init();

        $(global).resize(app.resizeAll);
        this.resizeAll();
    };

    return app;

})(window, document, jQuery);

$(document).ready(function() {
    app.init();
});