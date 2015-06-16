/**
 * The app object
 */
var app = (function(global, doc, $) {
    'use strict';
    var app = {
        'boardId': 1,
        'service': new Provider.Service()
    };

    /**
     * Resize all method for ui to bind on window resize.
     */
    app.resizeAll = function() {
        $('body').css({
            'height': $(window).height(),
            'width': '100%'
        });
        $('#body').css({
            'height': (parseInt($(window).height()) - 40) + 'px'
        });
        $('#activity_menu_container').css({
            'height': (parseInt($(window).height()) - 40) + 'px'
        });
        $('#lists_container').css({
            'height': (parseInt($(window).height()) - 105) + 'px'
        });
        $('.cards-container').css({
            'max-height': parseInt($('#lists_container').css('height')) -
            ( parseInt($('.list-header:first').css('height'))
            + parseInt($('.list-footer:first').css('height')) + 60 ) + 'px'
        });
    };

    /**
     * Returns the hash from url
     *
     * @return {string}
     */
    app.getHash = function() {
        return global.location.hash.replace('#', "");
    };

    /**
     * Updates the hash in url
     *
     * @param hash
     */
    app.updateHash = function(hash) {
        global.location.hash = '#' + hash;
    };

    /**
     * The init method of the application
     */
    app.init = function(simId) {
        this.board = new Board();
        this.board.init();
        this.menu = new Menu();
        this.menu.init();
        this.router = new Provider.Router();
        this.currentUserId = 1;
        this.currentUser = this.service.getUserDetail(this.currentUserId);

        $(global).resize(app.resizeAll);
        this.resizeAll();
    };

    return app;

})(window, document, jQuery);

$(document).ready(function() {
    app.init();
});