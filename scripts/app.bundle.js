APP_CONST = {
    'DATA_PATH': 'data',
    'API_BOARD': 'data/board.json',
    'API_LISTS': 'data/lists.json',
    'API_USER': 'data/user.json',
    'API_ACTIVITIES': 'data/activity.json'
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

var Provider = Provider || {};

/**
 * Class Router
 */
Provider.Router = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Router() {
        this.CLASS_NAME = 'Router';
        this.routes = {};

        this.listenToChange();
    }

    Router.prototype.addRoute = function(uri, callback) {
        this.routes[uri] = callback;
    };

    Router.prototype.delRoute = function(uri) {
        if(this.routes.hasOwnProperty(uri))
            delete this.routes[uri];

        return this;
    };

    Router.prototype.listenToChange = function() {
        var that = this, hash;

        $(global).on('hashchange', function() {
            hash = app.getHash();
            if(that.routes.hasOwnProperty(hash)) {
                that.routes[hash]();
            }
        });

        return this;
    };

    return Router;

})(window, document, jQuery);;

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
            return (e.boardId === boardId && e.status === 1);
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

    Service.prototype.addList = function(name) {
        var key = 'lists-details',
            list = {},
            lists = [],
            maxId,
            timestamp = new Date().getTime();
        if(this.cache[key] != null) {
            lists = this.cache[key];
        }
        else {
            lists = JSON.parse(this.storage.getItem(key));
        }

        maxId = _.result(_.max(lists, function(e) {
            return e.id;
        }), 'id');

        lists.push({
            'id': maxId + 1,
            'name': name,
            'created': timestamp,
            'owner': app.currentUserId,
            'boardId': app.boardId,
            'order': lists.length + 1,
            'status': 1
        });
        this.cache[key] = lists;
        this.storage.setItem(key, JSON.stringify(lists));

        this.addActivity({
            'user': app.currentUserId,
            'actionType': 'added',
            'object': 'list',
            'objectTitle': name,
            'timestamp': timestamp
        });

        return maxId + 1;
    };

    Service.prototype.setListName = function(listId, name) {
        var key = 'lists-details',
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

    Service.prototype.archiveList = function(listId) {
        var key = 'lists-details',
            lists = [];
        if(this.cache[key] != null) {
            lists = this.cache[key];
        }
        else {
            lists = JSON.parse(this.storage.getItem(key));
        }

        $.each(lists, function(i, v) {
            if(v.id === listId) {
                lists[i].status = 0;
            }
        });
        this.cache[key] = lists;
        this.storage.setItem(key, JSON.stringify(lists));

        return this;
    };

    Service.prototype.getMenuActivities = function() {
        var key = 'user-activity', toRet = {}, activities;
        if(this.storage.getItem(key) != null) {
            toRet = JSON.parse(this.storage.getItem(key));
        }
        else {
            activities = this.get(APP_CONST.API_ACTIVITIES);
            toRet = _.sortByOrder(activities, ['timestamp'], false);
            this.storage.setItem(key, JSON.stringify(toRet));
        }

        return toRet;
    };

    Service.prototype.addActivity = function(param) {
        var key = 'user-activity',
            activities = [];
        if(this.storage.getItem(key) != null) {
            activities = JSON.parse(this.storage.getItem(key));
        }
        else {
            activities = this.get(APP_CONST.API_ACTIVITIES);
            activities = _.sortByOrder(activities, ['timestamp'], false);
        }

        param.actionText = param.actionType + ' '
            + param.object + ' <a href="javascript:void(0);">'
            + param.objectTitle.substring(0, 19) + '</a>';
        activities.unshift({
            'user': param.user,
            'actionText': param.actionText,
            'timestamp': (param.timestamp != null) ? param.timestamp : new Date().getTime()
        });

        this.storage.setItem(key, JSON.stringify(activities));
        app.menu.addActivity(param);
    };

    Service.prototype.getUserDetail = function(userId) {
        var key = 'current-user', toRet = {}, users;
        if(this.cache[key] != null) {
            toRet = this.cache[key];
        }
        else if(this.storage.getItem(key) != null) {
            toRet = JSON.parse(this.storage.getItem(key));
            this.cache[key] = toRet;
        }
        else {
            users = this.get(APP_CONST.API_USER);
            toRet = _.find(users, function(e) {
                return e.id === userId;
            });
            this.cache[key] = toRet;
            this.storage.setItem(key, JSON.stringify(toRet));
        }

        return toRet;
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
            if(e.status === 1) {
                that.list.buildUi(e);
            }
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

/**
 * Class Card
 */
var Card = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Card() {
        this.CLASS_NAME = 'Card';
        this.template = 'card';
        this.cardDetailTemplate = 'card_detail';
        this.cardsContainer = '.cards-container';
        this.addNewCardBtn = '.add-new-card';
        this.cardAddContainer = '.add-card-container';
        this.cardNameInput = '.input-cardname';
        this.addCardSubmitBtn = '.add-card-container > .add-card';
        this.addCardCancelBtn = '.add-card-container > .cancel-card-add';
    }

    /**
     * Binds card related events
     */
    Card.prototype.bindEvents = function() {
        var that = this;

        $(this.addNewCardBtn).off('click').on('click', function() {
            var listId = $(this).data('listid');
            $('#list' + listId).find(that.cardAddContainer).show();
            $('#list' + listId).find(that.cardsContainer)
                .scrollTop($('#list' + listId).find(that.cardsContainer).prop('scrollHeight'));
        });
        $(this.addCardSubmitBtn).off('click').on('click', function() {
            var cardInputVal = $(this).parent().find(that.listRenameInput).val();
            if(cardInputVal != null && cardInputVal !== '') {
                $(this).parent().hide();
                // TODO: to start from here
                $(that.addNewList).show();
                that.add($(this).parent().find(that.listRenameInput).val());
                $(this).parent().find(that.listRenameInput).val('');
            }
        });
        $(this.newListCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(that.addNewList).show();
            $(this).parent().find(that.listRenameInput).val('');
        });
        $(this.addNewList).off('click').on('click', function() {
            $(that.newListAddBlock).show();
            $(this).hide();
        });
    };

    Card.prototype.buildUi = function(data) {
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

    Card.prototype.add = function(name) {
        var listId = app.service.addList(name);
        this.buildUi({
            'id': listId,
            'name': name
        });
    };

    Card.prototype.rename = function(listId, listName) {
        return app.service.setListName(listId, listName);
    };

    Card.prototype.archive = function() {
    };

    /**
     * The init method of the class
     */
    Card.prototype.init = function(data) {
        if(data == null) {
            throw new Error('List cannot be initialized null');
        }
        this.data = data;
        this.buildUi();
        this.bindEvents();
    };

    return Card;

})(window, document, jQuery);;

/**
 * Class List
 */
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
        this.addNewList = '.list-adder';
        this.newListAddBlock = '.new-list > .list-rename';
        this.newListSaveBtn = '.new-list .save-listname';
        this.newListCancelBtn = '.new-list .cancel-list-rename';
        this.dropdownList = '.list-drop';
        this.dropdownListOpen = '.list-header > .fa-angle-down';
        this.dropdownListClose = '.drop-header > .fa-times';
        this.archiveListBtn = '.archive-list';
        this.copyListBtn = '.copy-list';
        this.cardsContainer = '.cards-container';
        
        this.card = new Card();
    }

    /**
     * Binds all events related to list template
     */
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
            if(that.rename(listId, listName) != null) {
                $(this).parent().parent().find(that.listHeaderText).text(listName);
            }
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });
        $(this.listRenameCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });

        $(this.newListSaveBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(that.addNewList).show();
            that.add($(this).parent().find(that.listRenameInput).val());
            $(this).parent().find(that.listRenameInput).val('');
        });
        $(this.newListCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(that.addNewList).show();
            $(this).parent().find(that.listRenameInput).val('');
        });
        $(this.addNewList).off('click').on('click', function() {
            $(that.newListAddBlock).show();
            $(this).hide();
        });

        $(this.dropdownListOpen).off('click').on('click', function() {
            var listid = $(this).parent().data('listid');
            $(that.dropdownList).hide();
            $(that.dropdownList + '[rel="list'+listid+'"]').show();
            $("#list"+listid).find(that.cardsContainer).scrollTop(0);
            
        });
        $(this.dropdownListClose).off('click').on('click', function() {
            $(this).parent().parent().hide();
            
            $(that.cardsContainer).each(function() {
                $(this).scrollTop($(this).prop('scrollHeight'));
            });
        });
        $(this.archiveListBtn).off('click').on('click', function() {
            that.archive($(this).data('listid'));
        });
        
        this.card.bindEvents();
    };

    /**
     * Builds the list with provided data
     *
     * @param data
     */
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

    /**
     * Adds a list into board
     *
     * @param name
     */
    List.prototype.add = function(name) {
        var listId = app.service.addList(name);
        this.buildUi({
            'id': listId,
            'name': name
        });
    };

    /**
     * Renames a list
     *
     * @param listId
     * @param listName
     */
    List.prototype.rename = function(listId, listName) {
        return app.service.setListName(listId, listName);
    };

    /**
     * Archives list
     *
     * @param listId
     */
    List.prototype.archive = function(listId) {
        app.service.archiveList(listId);
        $("#list" + listId).hide();
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
        this.activityTemplate = 'activity';
        this.showMenuBtn = '#show_activity_menu';
        this.hideMenuBtn = '#hide_activity_menu';
        this.menuInnerContainer = '#activity_menu_container';
        this.activityContainer = '.activities';
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
        var that = this,
            user,
            options = {
                hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "numeric"
            },
            t;

        this.menuActivities = app.service.getMenuActivities(app.boardId);
        $.each(this.menuActivities, function(i, v) {
            user = app.service.getUserDetail(v.user);
            that.menuActivities[i].userName = user.name;
            that.menuActivities[i].avatar = user.avatar;
            t = new Date(parseInt(v.timestamp));
            that.menuActivities[i].timestamp = t.toLocaleTimeString("en-us", options);
        });

        $(this.container).html(utils.loadTemplate(that.template, {
            'activities': that.menuActivities
        }));

        this.bindEvents();
    };

    /**
     * Adds actovity into menu activity section
     *
     * @param param
     */
    Menu.prototype.addActivity = function(param) {
        var that = this,
            t = new Date(parseInt(param.timestamp)),
            options = {
                hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "numeric"
            },
            user = app.service.getUserDetail(param.user);
        param.userName = user.name;
        param.avatar = user.avatar;
        param.timestamp = t.toLocaleTimeString("en-us", options);

        $(this.activityContainer).find('h4').after(utils.loadTemplate(that.activityTemplate, param));
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
        
        $('.cards-container').each(function() {
            $(this).scrollTop($(this).prop('scrollHeight'));
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
        this.router = new Provider.Router();
        this.currentUserId = 1;
        this.currentUser = this.service.getUserDetail(this.currentUserId);

        $(global).resize(app.resizeAll);
        this.resizeAll();
    };

    return app;

})(window, document, jQuery);

$(document).ready(function() {
    app.init();
});