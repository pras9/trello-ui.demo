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
    }

    Card.prototype.bindEvents = function() {
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

})(window, document, jQuery);