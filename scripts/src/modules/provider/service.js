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
    }

    Service.prototype.getBoardDetail = function(boardId) {
        var boardDetail = {}, toRet = {};
        $.ajax({
            type: 'GET',
            url: APP_CONST.API_BOARD,
            dataType: 'json',
            async: false,
            success: function(data) {
                boardDetail = data;
            },
            error: function(response) {
                console.log(response);
            }
        });
        toRet = _.filter(boardDetail, function(e) {
            return e.id === boardId;
        });

        return toRet;
    };

    Service.prototype.getBoardLists = function(boardId) {
        var boardLists = {}, toRet = {};
        $.ajax({
            type: 'GET',
            url: APP_CONST.API_LISTS,
            dataType: 'json',
            async: false,
            success: function(data) {
                boardLists = data;
            },
            error: function(response) {
                console.log(response);
            }
        });
        toRet = _.filter(boardLists, function(e) {
            return e.boardId === boardId;
        });

        return toRet;
    };

    Service.prototype.getCards = function(listId) {
        var boardLists = {}, toRet = {};
        $.ajax({
            type: 'GET',
            url: APP_CONST.API_LISTS,
            dataType: 'json',
            async: false,
            success: function(data) {
                boardLists = data;
            },
            error: function(response) {
                console.log(response);
            }
        });
        toRet = _.filter(boardLists, function(e) {
            return e.id === listId;
        });

        return toRet[0].cards;
    };

    Service.prototype.getMenuActivities = function() {
        return {};
    };

    return Service;

})(window, document, jQuery);