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
    }

    List.prototype.bindEvents = function() {
    };

    List.prototype.buildUi = function(data) {
        var that = this;
        if(data != null) {
            this.data = data;
        }
        if(this.data == null) {
            throw new Error('Cannot build ui for null list');
        }

        if(this.data.cards == null)
            this.data.cards = app.service.getCards(this.data.id);
        $(this.beforeElement).before(
            utils.loadTemplate(that.template, {
                'list_header': that.data.name,
                'cards': that.data.cards
            })
        );
    };

    List.prototype.add = function() {
    };

    List.prototype.rename = function() {
    };

    List.prototype.archive = function() {
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