/**
 * The utils object
 */
var utils = (function(global, doc, $, _) {
    'use strict';
    var utils = {};

    /**
     * Loads given partial template and return it with data filled
     *
     * @param template
     * @param data
     * @return {*}
     */
    utils.loadTemplate = function(template, data) {
        var template_str = "";

        $.ajax({
            type: 'GET',
            url: APP_PATH.TEMPLATES + '/' + template,
            dataType: 'text',
            async: false,
            success: function(html) {
                template_str = html;
            }
        });

        template = _.template(template_str);
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
     * To get the class from give type string
     *
     * @param str
     * @return {Object}
     */
    utils.type2ClassName = function(str) {
        var retStr = "", strArr = str.split('_'), i = 0;
        for(i = 0; i < strArr.length; i++) {
            retStr += strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
        }

        return retStr;
    };

    /**
     * To get the class from give type string
     *
     * @param str
     * @return {Object}
     */
    utils.type2Class = function(str) {
        var className = this.type2ClassName(str);
        if(!global.hasOwnProperty(className)) {
            throw new Error("Class " + className + " does not exists!");
        }
        return eval(className);
    };

    /**
     * Trims the CDATA out of given string(/html) from xml
     *
     * @param str
     * @return {*}
     */
    utils.trimCData = function(str) {
        if(str != null) {
            str = str.replace('<![CDATA[', '');
            str = str.replace(']]>', '');
            str = str.replace(']]&gt', '');
        }
        else {
            str = '';
        }
        return str;
    }

    return utils;

})(window, document, jQuery, _);
