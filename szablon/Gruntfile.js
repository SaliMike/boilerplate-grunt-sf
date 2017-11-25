module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'scripts/main.min.js': 'scripts/main.min.js'
        },
        output: {
          comments: false
        }
      }
    },
    browserify: {
      dev: {
        files: {
          'scripts/main.min.js': 'components/main.js'
        },
        options: {
          transform: [
            ['babelify', {
              presets: "env"
            }]
          ],
          browserifyOptions: {
            debug: true
          }
        }
      },
      dist: {
        files: {
          'scripts/main.min.js': 'components/main.js'
        },
        options: {
          transform: [
            ['babelify', {
              presets: "env"
            }]
          ],
          browserifyOptions: {
            debug: false
          }
        }
      }
    },
    mocha: {
      options: {
        run: true,
        log: true,
        logErrors: true,
        reporter: 'spec',
        quiet: false,
        clearRequireCache: false,
        clearCacheFilter: (key) => true,
        noFail: false,
        ui: 'tdd',
        require: 'babel-register'
      },
      src: ['test/**/*.html']
    },
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed',
          lineNumbers: false,
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'components',
          src: ['*.sass'],
          dest: 'css',
          ext: '.min.css'
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
          src: ['*.sass'],
          dest: 'css',
          ext: '.min.css'
        }]
      },
    },

    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version']
            })
          ]
        },
        dist: {
          src: 'css/main.min.css',
          dest: 'css/main.min.css'
        }
      },
      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version']
            })
          ]
        },
        dist: {
          src: 'css/main.min.css',
          dest: 'css/main.min.css'
        }
      }
    },

    pug: {
      compile: {
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
      }
    },

    browserSync: {
      bsFiles: {
        src: ['css/main.min.css', '*.html', 'scripts/main.min.js']
      },
      options: {
        watchTask: true,
        server: {
          directory: true,
          baseDir: "./"
        }, port: 9000
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'components/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'components/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['components/**/*.js', 'assets/js/*.js'],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['components/**/*.sass', 'assets/styles/*.sass'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          spawn: false
        }
      },
      pug: {
        files: ['pug/*.pug', 'components/**/*.pug'],
        tasks: ['pug:compile'],
        options: {
          spawn: false,
          pretty: true
        }
      },
      reload: {
        files: ['components/**/src/*', '*.html', 'scripts/*', 'css/*'],
        options: {
          livereload: true
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['watch:scripts', 'watch:sass', 'watch:pug', 'watch:reload']
      },
      prod: {
        tasks: ['watch:scripts', 'watch:sass']
      },
      build: {
        tasks: ['browserify:dist', 'uglify:dist', 'sass:dist', 'postcss:dist', 'concurrent:optimal']
      },
      optimal: {
        tasks: ['imagemin']
      }
    }
  });

  grunt.registerTask('dev', ['browserSync', 'concurrent:dev']);
  grunt.registerTask('prod', ['concurrent:prod']);
  grunt.registerTask('build', ['concurrent:build']);
  grunt.registerTask('optimal', ['concurrent:optimal']);
  grunt.registerTask('test', ['mocha']);
};