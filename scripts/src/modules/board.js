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

})(window, document, jQuery);