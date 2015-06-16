var Provider = Provider || {};

/**
 * Class Router
 */
Provider.Router = (function(global, doc, $) {
    'use strict';

    /**
     * @constructor
     */
    function Router() {
        this.CLASS_NAME = 'Router';
        this.routes = {};

        this.listenToChange();
    }

    Router.prototype.addRoute = function(uri, callback) {
        this.routes[uri] = callback;
    };

    Router.prototype.delRoute = function(uri) {
        if(this.routes.hasOwnProperty(uri))
            delete this.routes[uri];

        return this;
    };

    Router.prototype.listenToChange = function() {
        var that = this, hash;

        $(global).on('hashchange', function() {
            hash = app.getHash();
            if(that.routes.hasOwnProperty(hash)) {
                that.routes[hash]();
            }
        });

        return this;
    };

    return Router;

})(window, document, jQuery);