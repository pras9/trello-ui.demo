/**
 * Class UiBuilder
 */
var UiBuilder = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function UiBuilder() {
        this.CLASS_NAME = 'UiBuilder';
        this.$baseContainer = $(APP_CONST.APP_CONTAINER);
        this.baseTemplate = 'base.html';
    }

    /**
     * It builds the basic layout of the page
     */
    UiBuilder.prototype.buildBase = function() {
        this.$baseContainer.html(utils.loadTemplate(this.baseTemplate, {}));
        $('title').html($(data).find('simulation').attr('title'));
    };

    /**
     * It loads the correct module for the given screen
     *
     * @param screen
     */
    UiBuilder.prototype.buildScreen = function(screen) {
        var $screen = $(screen),
            moduleName = 'Screen' + $screen.attr('id'),
            moduleClass = (global.hasOwnProperty(moduleName)) ? eval(moduleName) : null,
            module = null;

        if(moduleClass !== undefined && moduleClass !== null) {
            module = new moduleClass($screen);
            module.init();
        }
        else if( global.hasOwnProperty(utils.type2ClassName($screen.attr('type'))) ) {
            moduleClass = utils.type2Class($screen.attr('type'));
            module = new moduleClass($screen);
            module.init();
        }
        else {
            throw new Error("Module: "+moduleName+" is not present!");
        }
    };

    return UiBuilder;

})(window, document, jQuery);