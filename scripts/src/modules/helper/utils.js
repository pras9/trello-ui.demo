/**
 * The utils object
 */
var utils = (function(global, doc, $, _) {
    'use strict';
    var utils = {};

    /**
     * Loads given partial template and return it as string with data filled
     *
     * @param template
     * @param data
     * @return {*}
     */
    utils.loadTemplate = function(templateName, data) {
        var template_str = $('script#' + templateName + '_view').html(),
            template = _.template(template_str, { 'imports': { 'jq': $ } });
        return template(data);
    };

    /**
     * Extends(inherits) class b from d
     *
     * @param d
     * @param b
     * @private
     */
    utils.__extends = function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        __.prototype = b.prototype;
        d.prototype = new __();
    };

    /**
     * To get the class name from a given string
     *
     * @param str
     * @return {Object}
     */
    utils.str2ClassName = function(str) {
        var retStr = "", strArr = str.split('_'), i = 0;
        for(i = 0; i < strArr.length; i++) {
            retStr += strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
        }

        return retStr;
    };

    /**
     * To get the class from a given string as name of the class
     *
     * @param str
     * @return {Object}
     */
    utils.str2Class = function(str) {
        var className = this.str2ClassName(str);
        if(!global.hasOwnProperty(className)) {
            throw new Error("Class " + className + " does not exists!");
        }
        return eval(className);
    };

    return utils;

})(window, document, jQuery, _);
