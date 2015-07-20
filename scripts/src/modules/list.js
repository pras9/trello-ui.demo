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
        this.bindEvents();
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

})(window, document, jQuery);