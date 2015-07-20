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
        this.footerAddNewCardBtn = '.list-footer > .add-new-card';
        this.cardAddContainer = '.add-card-container';
        this.cardNameInput = '.input-cardname';
        this.addCardSubmitBtn = '.add-card-container > .add-card';
        this.addCardCancelBtn = '.add-card-container > .cancel-card-add';
        this.dropdownList = '.list-drop';
        this.$currentList = null;
    }

    /**
     * Binds card related events
     */
    Card.prototype.bindEvents = function() {
        var that = this;

        $(this.addNewCardBtn).off('click').on('click', function() {
            var listId = $(this).data('listid');
            that.$currentList = $('#list' + listId);
            that.$currentList.find(that.cardAddContainer).show();
            that.$currentList.find(that.cardsContainer)
                .scrollTop(that.$currentList.find(that.cardsContainer).prop('scrollHeight'));
            
            that.$currentList.find(that.footerAddNewCardBtn).hide();
            that.$currentList.find(that.dropdownList).hide();
        });
        
        $(this.addCardSubmitBtn).off('click').on('click', function() {
            var cardInputVal = $(this).parent().find(that.cardNameInput).val();
            if(cardInputVal != null && cardInputVal !== '') {
                $(this).parent().hide();
                that.add(
                    $(this).parent().data('listid'),
                    $(this).parent().find(that.cardNameInput).val()
                );
                $(this).parent().find(that.cardNameInput).val('');
            }
            $(this).parent().hide();
            $(this).parent().parent().parent().find(that.addNewCardBtn).show();
        });
        
        $(this.addCardCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(this).parent().find(that.cardNameInput).val('');
            $(this).parent().parent().parent().find(that.addNewCardBtn).show();
        });
    };

    /**
	 * Loads the template inside DOM
	 * 
	 * @param data
	 */
	Card.prototype.buildUi = function(data) {
        var that = this;
        if(data != null) {
            this.data = data;
        }
        if(this.data == null) {
            throw new Error('Cannot build ui for null list');
        }
    };

    Card.prototype.add = function(listId, name) {
        var cardId = app.service.addCard(listId, name),
            that = this;
        
        that.$currentList.find(that.cardAddContainer).before(
            utils.loadTemplate(that.template, {
                'title': name
            })
        );
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