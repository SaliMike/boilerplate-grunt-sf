module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  //lista zewnetrznych skryptów
  var vendorScripts = [
    'node_modules/jquery/dist/jquery.min.js'
  ];

  grunt.initConfig({
    uglify: {
      dist: {
        src: [vendorScripts, 'libraries/*.js', 'components/**/*.js', '!scripts/main.min.js'],
        dest: 'scripts/main.min.js'
      },
      dev: {
        src: [vendorScripts, 'libraries/*.js', 'components/**/*.js', '!scripts/main.min.js'],
        dest: 'scripts/main.min.js',
        options: {
          beautify: true,
          compress: false,
          mangle: false,
          sourceMap: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed',
          lineNumbers: false
        },
        files: [{
          expand: true,
          cwd: 'components',
          src: ['*.scss', '*.sass'],
          dest: 'css',
          ext: '.css'
        }]
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          lineNumbers: true,
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'components',
          src: ['*.scss', '*.sass'],
          dest: 'css',
          ext: '.css'
        }]
      },
      tasks: ['autoprefixer']
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        src: 'css/main.css',
        dest: 'css/main.css'
      }
    },
    pug: {
      dev: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: 'pug',
          src: ['*.pug', '!_*.pug'],
          dest: '',
          ext: '.html'
        }]
      },
      dist: {
        options: {
          data: {
            debug: false
          },
          pretty: false
        },
        files: [{
          expand: true,
          cwd: 'pug',
          src: ['*.pug', '!_*.pug'],
          dest: '',
          ext: '.html'
        }]
      }
    },
    connect: {
      all: {
        options:{
          port: 9000,
          hostname: "0.0.0.0",
          keepalive: true,
          livereload: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['!scripts/main.min.js', 'libraries/*.js', 'scripts/vendor/*.js', 'components/*.js', 'components/**/*.js'],
        tasks: ['uglify:dev'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['components/*.scss', 'components/*.sass', 'components/**/*.scss', 'components/**/*.sass','tools/*.sass'],
        tasks: ['sass:dev', 'autoprefixer'],
        options: {
          spawn: false
        }
      },
      pug: {
        files: ['pug/*.pug', 'components/**/*.pug'],
        tasks: ['pug:dev'],
        options: {
          spawn: false,
          pretty: true
        }
      },
      reload: {
        files: ['components/*/src/*', '*.html', 'scripts/*', 'css/*'],
        options: {
          livereload: true
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      front: {
        tasks: ['watch:scripts', 'watch:sass', 'watch:pug', 'watch:reload', 'connect']
      },
      dev: {
        tasks: ['watch:scripts', 'watch:sass']
      }
    }
  });

  //grunt task developerski po wdrożeniu, kompilacja js i sass
  grunt.registerTask('default', ['concurrent:dev']);
  //grunt task generujący zminimalizowany kod na produkcję
  grunt.registerTask('build', ['uglify:dist', 'sass:dist']);
  //grunt task do przeznaczony do tworzenia szablonu, uruchamia live reload server
  grunt.registerTask('server', ['concurrent:front']);
};