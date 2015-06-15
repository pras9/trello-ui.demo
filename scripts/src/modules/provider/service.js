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

})(window, document, jQuery);