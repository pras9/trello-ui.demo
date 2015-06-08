module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                src: [
                    'scripts/src/config/*.js',
                    'scripts/src/modules/interactions/*.js',
                    'scripts/src/modules/*.js',
                    'scripts/src/utils.js',
                    'scripts/src/ui_builder.js',
                    'scripts/src/score_calculator.js',
                    'scripts/src/app.js',
                ],
                dest: 'scripts/app.bundle.js'
            },
            vendor: {
                src: [
                    'scripts/vendor/jquery-2.1.4.js',
                    'scripts/vendor/jquery-ui.js',
                    'scripts/vendor/bootstrap.js',
                    'scripts/vendor/underscore.js'
                ],
                dest: 'scripts/vendor.bundle.js'
            }
        }
    });
    grunt.registerTask('default', [
        'concat'
    ]);
};