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

})(window, document, jQuery);