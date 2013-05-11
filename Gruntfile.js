module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          dir: "build",

          optimize: 'uglify2',
          optimizeCss: 'standard',
          inlineText: true,

          modules: [
            { name: 'cannon_app' }
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      source: [ 'src/**/*.js', 'index.html' ]
    },

    regarde: {
      js: {
        files: [ 'src/**/*.js' ],
        tasks: [ 'livereload' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', [ 'jshint', 'requirejs' ]);
  grunt.registerTask('watch',  [ 'livereload-start', 'regarde' ]);
  grunt.registerTask('server', [ 'livereload-start', 'connect', 'regarde' ]);
};
