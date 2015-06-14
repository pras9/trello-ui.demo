module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                options: {
                    separator: ';\n\n',
                },
                src: [
                    'scripts/src/config/*.js',
                    'scripts/src/modules/helper/*.js',
                    'scripts/src/modules/provider/*.js',
                    'scripts/src/modules/*.js',
                    'scripts/src/app.js',
                ],
                dest: 'scripts/app.bundle.js'
            },
            vendor: {
                options: {
                    separator: ';\n\n',
                },
                src: [
                    'scripts/vendor/jquery-2.1.4.min.js',
                    'scripts/vendor/jquery-ui.min.js',
                    'scripts/vendor/bootstrap.min.js'
                ],
                dest: 'scripts/vendor.bundle.js'
            },
            devhtml: {
                src: [
                    'templates/base/0-dev.html',
                    'templates/*.html',
                    'templates/base/z-dev.html'
                ],
                dest: 'index.html'
            },
            prohtml: {
                src: [
                    'templates/base/0-pro.html',
                    'templates/*.html',
                    'templates/base/z-pro.html'
                ],
                dest: 'index.html'
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: true
            },
            app: {
                files: {
                    'scripts/app.bundle.min.js': ['scripts/app.bundle.js']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'styles/css/main.bundle.min.css': [
                        'styles/css/bootstrap.css', 
                        'styles/css/font-awesome.css',
                        'styles/css/jquery-ui.css',
                        'styles/css/main.css'
                    ]
                }
            }
        },
        clean: {
            js: ["scripts/app.bundle.js"]
        }
    });
    grunt.registerTask('default', [
        'concat:app', 'concat:vendor', 'concat:devhtml'
    ]);
    grunt.registerTask('prod', [
        'concat:app', 'concat:vendor', 'uglify', 'cssmin', 'concat:prohtml', 'clean'
    ]);
};