/**
 * The app object
 */
var app = (function(global, doc, $) {
    'use strict';
    var app = {};

    /**
     * The init method of the application
     *
     * @param simId
     */
    app.init = function(simId) {
        if (simId == null || simId == "") {
            throw new Error("Simulation ID not provided for the app to start!");
        }
        var that = this;
        this.simId = simId;
        this.currentScreenIndex = 0;
        this.scoreCalculator = new ScoreCalculator();
        this.complete = false;
        this.settings = {
            totalPossibleScore: [],
            attempts: [],
            totalScreens: 0
        };
        this.moduleData = {};
        this.moduleData.screen = [];
        $.ajax({
            type: 'GET',
            url: APP_PATH.DATA + '/sim' + this.simId + '.xml',
            dataType: 'text',
            async: true,
            success: function (data) {
                that.processData(data);
            }
        });
    };

    /**
     * Returns the hash from url
     *
     * @return {string}
     */
    app.getHash = function() {
        return window.location.hash.replace('#', "");
    };

    /**
     * Updates the hash in url
     *
     * @param hash
     */
    app.updateHash = function(hash) {
        window.location.hash = '#' + hash;
    };

    /**
     * It will process the common part out of loaded XML
     *
     * @param data
     */
    app.processData = function(data) {
        var type = null,
            hasPoints = 'false',
            points = 0;
        global.data = $.parseXML(data);

        this.settings.totalScreens = $(data).find('screen').size();
        this.settings.type = $(data).find('simulation').attr('type');
        //TODO: fetch the common app settings out of the xml
        //e.g. this.totalPossiblePoints = ...

        // creates the ui builder object
        this.uiBuilder = new UiBuilder();
        //creates common layout of the page
        this.uiBuilder.buildBase();
        this.nextScreen();
    };

    /**
     * Get current screen data
     *
     * @return {*}
     */
    app.getScreenData = function() {
        if(this.moduleData.screen[this.currentScreenIndex] != null) {
            return this.moduleData.screen[this.currentScreenIndex];
        }
        return null;
    };

    /**
     * Set current screen data
     *
     * @param data
     * @return {*}
     */
    app.updateScreenData = function(data) {
        this.moduleData.screen[this.currentScreenIndex] = data;
    };

    /**
     * It will load the next screen into browser
     */
    app.nextScreen = function() {
        var $screen = null;
        this.currentScreenIndex += 1;
        $screen = $(global.data).find('screen[id='+this.currentScreenIndex+']');
        if($screen.length > 0 && this.complete !== true) {
            this.uiBuilder.buildScreen($screen);
            this.moduleData.screen.push({});
            app.updateHash('screen' + this.currentScreenIndex);
            $(APP_CONST.APP_CONTAINER).focus();
        }
        else {
            this.complete = true;
        }
    };

    return app;

})(window, document, jQuery);

$(document).ready(function() {
    app.init(APP_CONST.SIMULATION_ID);
});