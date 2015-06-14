/**
 * Class Menu
 */
var Menu = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Menu() {
        this.CLASS_NAME = 'Menu';
        this.container = '#menu_container';
        this.template = 'menu';
        this.showMenuBtn = '#show_activity_menu';
        this.hideMenuBtn = '#hide_activity_menu';
        this.menuInnerContainer = '#activity_menu_container';
    }

    /**
     * Bind events
     */
    Menu.prototype.bindEvents = function() {
        var that = this;

        $(this.showMenuBtn).click(function() {
            setTimeout(function() {
                $(that.hideMenuBtn).show();
            }, 700);
            $(that.menuInnerContainer).show("slide", { direction: "right" }, 600);
        });
        $(this.hideMenuBtn).click(function() {
            $(this).hide();
            $(that.menuInnerContainer).hide("slide", { direction: "right" }, 600);
        });
    };

    /**
     * Loads the template and builds the UI of Menu
     */
    Menu.prototype.buildUi = function() {
        var that = this;

        this.menuActivities = app.service.getMenuActivities(app.boardId);

        $(this.container).html(utils.loadTemplate(that.template, {
            'activities': that.menuActivities
        }));

        this.bindEvents();
    };

    /**
     * The init method of the class
     */
    Menu.prototype.init = function() {
        this.buildUi();
        this.bindEvents();
    };

    return Menu;

})(window, document, jQuery);