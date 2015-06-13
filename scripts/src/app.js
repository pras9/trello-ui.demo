/**
 * The app object
 */
var app = (function(global, doc, $) {
    'use strict';
    var app = {};

    /**
     * The init method of the application
     */
    app.init = function(simId) {
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

    return app;

})(window, document, jQuery);

$(document).ready(function() {
    app.init();
});