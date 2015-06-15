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
    }

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
            if(app.service.setListName(listId, listName) != null) {
                $(this).parent().parent().find(that.listHeaderText).text(listName);
            }
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });
        $(this.listRenameCancelBtn).off('click').on('click', function() {
            $(this).parent().hide();
            $(this).parent().parent().find(that.listHeader).show();
        });
    };

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