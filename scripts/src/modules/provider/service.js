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
            key = 'trlo.service.boards';
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
            key = 'trlo.service.lists',
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
            this.cache['trlo.service.cards'] = cards;
            this.storage.setItem(key, JSON.stringify(listDetail));
            this.storage.setItem('trlo.service.cards', JSON.stringify(cards));

            toRet = listDetail;
        }

        return _.filter(toRet, function(e) {
            return (e.boardId === boardId && e.status === 1);
        });
    };

    Service.prototype.getCards = function(listId) {
        var toRet = {},
            list = {},
            key = 'trlo.service.cards';
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

    Service.prototype.getMenuActivities = function() {
        var key = 'trlo.service.user-activity', toRet = {}, activities;
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
        var key = 'trlo.service.user-activity',
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
        var key = 'trlo.service.current-user', toRet = {}, users;
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

    Service.prototype.addList = function(name) {
        var key = 'trlo.service.lists',
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
        var key = 'trlo.service.lists',
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
        var key = 'trlo.service.lists',
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
    
    Service.prototype.addCard = function(listId, name) {
        var key = "trlo.service.cards", 
            cards = [], 
            maxId,
            timestamp = new Date().getTime();
        if(this.cache[key] != null) {
            cards = this.cache[key];
        }
        else if(this.storage.getItem(key) != null) {
            cards = JSON.parse(this.storage.getItem(key));
            this.cache[key] = cards;
        }
        else {
            throw new Error('Some error occured');
        }

        maxId = _.result(_.max(cards, function(e) {
            return e.id;
        }), 'id');

        cards.push({
            "id" : maxId + 1,
            "listId" : listId,
            "title" : name,
            "description" : "",
            "created" : timestamp,
            "modified" : timestamp,
            "labels" : {},
            "dueDate" : null,
            "status" : 1
        });
        this.cache[key] = cards;
        this.storage.setItem(key, JSON.stringify(cards));

        this.addActivity({
            'user': app.currentUserId,
            'actionType': 'added',
            'object': 'card',
            'objectTitle': name,
            'timestamp': timestamp
        });

        return maxId + 1;
    }

    return Service;

})(window, document, jQuery);