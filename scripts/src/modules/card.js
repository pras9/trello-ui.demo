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

    
    Card.prototype.bindEvents = function() {
        var that = this;

        $(this.addNewCardBtn).off('click').on('click', function() {
            var listId = $(this).data('listid');
            $('#list' + listId).find(that.cardAddContainer).show();
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

})(window, document, jQuery);