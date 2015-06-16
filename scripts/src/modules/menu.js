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
        this.activityTemplate = 'activity';
        this.showMenuBtn = '#show_activity_menu';
        this.hideMenuBtn = '#hide_activity_menu';
        this.menuInnerContainer = '#activity_menu_container';
        this.activityContainer = '.activities';
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
        var that = this,
            user,
            options = {
                hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "numeric"
            },
            t;

        this.menuActivities = app.service.getMenuActivities(app.boardId);
        $.each(this.menuActivities, function(i, v) {
            user = app.service.getUserDetail(v.user);
            that.menuActivities[i].userName = user.name;
            that.menuActivities[i].avatar = user.avatar;
            t = new Date(parseInt(v.timestamp));
            that.menuActivities[i].timestamp = t.toLocaleTimeString("en-us", options);
        });

        $(this.container).html(utils.loadTemplate(that.template, {
            'activities': that.menuActivities
        }));

        this.bindEvents();
    };

    /**
     * Adds actovity into menu activity section
     *
     * @param param
     */
    Menu.prototype.addActivity = function(param) {
        var that = this,
            t = new Date(parseInt(param.timestamp)),
            options = {
                hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "numeric"
            },
            user = app.service.getUserDetail(param.user);
        param.userName = user.name;
        param.avatar = user.avatar;
        param.timestamp = t.toLocaleTimeString("en-us", options);

        $(this.activityContainer).find('h4').after(utils.loadTemplate(that.activityTemplate, param));
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