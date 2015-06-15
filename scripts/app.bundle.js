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
        this.storage = global.localStorage;
    }

    Service.prototype.get = function(uri) {
        var dataToRet = {};
        $.ajax({
            type: 'GET',
            url: uri,
            dataType: 'json',
            async: false,
            success: function (data) {
                dataToRet = data;
            },
            error: function (response) {
                console.log(response);
            }
        });

        return dataToRet;
    };

    Service.prototype.getBoardDetail = function(boardId) {
        var boardDetail = {},
            toRet = {},
            key = 'boards-details';
        if(this.cache[key] != null) {
            boardDetail = this.cache[key];
        }
        else if(this.storage.getItem(key) != null) {
            boardDetail = JSON.parse(this.storage.getItem(key));
            this.cache[key] = boardDetail;
        }
        else {
            boardDetail = this.get(APP_CONST.API_BOARD);
            this.cache[key] = boardDetail;
            this.storage.setItem(key, JSON.stringify(boardDetail));
        }
        toRet = _.find(boardDetail, function(e) {
            return e.id === boardId;
        });

        return toRet;
    };

    Service.prototype.getBoardLists = function(boardId) {
        var lists = {},
            toRet = {},
            key = 'lists-details',
            listDetail = [],
            cards = [];
        if(this.cache[key] != null) {
            toRet = this.cache[key];
        }
        else if(this.storage.getItem(key) != null) {
            toRet = JSON.parse(this.storage.getItem(key));
            this.cache[key] = toRet;
        }
        else {
            lists = this.get(APP_CONST.API_LISTS);

            $.each(lists, function(i, e) {
                listDetail.push({
                    "id": e.id,
                    "name": e.name,
                    "created": e.created,
                    "owner": e.owner,
                    "boardId": e.boardId,
                    "order": e.order,
                    "status": e.status,
                });
                $.each(e.cards, function(j, v) {
                    v.listId = e.id;
                    cards.push(v);
                });
            });

            this.cache[key] = listDetail;
            this.cache['cards-details'] = cards;
            this.storage.setItem(key, JSON.stringify(listDetail));
            this.storage.setItem('cards-details', JSON.stringify(cards));

            toRet = listDetail;
        }

        return _.filter(toRet, function(e) {
            return e.boardId === boardId;
        });
    };

    Service.prototype.getCards = function(listId) {
        var toRet = {},
            list = {},
            key = 'cards-details';
        if(this.cache[key] != null) {
            toRet = this.cache[key];
        }
        else {
            toRet = JSON.parse(this.storage.getItem(key));
            this.cache[key] = toRet;
        }

        return _.filter(toRet, function(e) {
            return e.listId === listId;
        });
    };

    Service.prototype.setListName = function(listId, name) {
        var key = 'lists-details',
            list = {},
            lists = [];
        if(this.cache[key] != null) {
            lists = this.cache[key];
        }
        else {
            lists = JSON.parse(this.storage.getItem(key));
        }

        $.each(lists, function(i, v) {
            if(v.id === listId) {
                lists[i].name = name;
            }
        });
        this.cache[key] = lists;
        this.storage.setItem(key, JSON.stringify(lists));

        return this;
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
        this.list.bindEvents();
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
        this.listHeader = '.list-header';
        this.listHeaderText = '.list-header > span';
        this.listRenameBlock = '.list-rename';
        this.listRenameInput = '.input-listname';
        this.listRenameSaveBtn = '.list-rename .save-listname';
        this.listRenameCancelBtn = '.list-rename .cancel-list-rename';
    }

    List.prototype.bindEvents = function() {
        var that = this;

        $(this.listHeaderText).off('click').on('click', function() {
            $(this).parent().hide();
            $(this).parent().parent().find(that.listRenameBlock)
                .show()
                .find(that.listRenameInput).val($(this).text());
        });
        $(this.listRenameSaveBtn).off('click').on('click', function() {
            var listName = $(this).parent().find(that.listRenameInput).val(),
                listId = $(this).parent().parent().find(that.listHeader).data('listid');
            if(app.service.setListName(listId, listName) != null) {
                $(this).parent().parent().find(that.listHeaderText).text(listName);
            }
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });
        $(this.listRenameCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });
    };

    List.prototype.buildUi = function(data) {
        var that = this;
        if(data != null) {
            this.data = data;
        }
        if(this.data == null) {
            throw new Error('Cannot build ui for null list');
        }

        this.data.cards = app.service.getCards(this.data.id);
        $(this.beforeElement).before(
            utils.loadTemplate(that.template, {
                'listid': that.data.id,
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