/*eslint-disable */
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  const webpackConfig = require('./webpack.config');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'assets/scripts/main.min.js': ['assets/scripts/main.min.js']
        },
      }
    },
    webpack: {
      options: {},
      prod: webpackConfig,
      dev: webpackConfig,
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
          sourceMap: false,
          includePaths: ['node_modules']
        },
        files: [{
          expand: true,
          cwd: 'components',
          src: ['*.sass'],
          dest: 'assets/styles',
          ext: '.min.css'
        }]
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          lineNumbers: true,
          sourceMap: true,
          includePaths: ['node_modules']
        },
        files: [{
          expand: true,
          cwd: 'components',
          src: ['*.sass'],
          dest: 'assets/styles',
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
        src: 'assets/styles/main.min.css',
        dest: 'assets/styles/main.min.css'
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
        src: 'assets/styles/main.min.css',
        dest: 'assets/styles/main.min.css'
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
        src: ['assets/styles/main.min.css', '*.html', 'assets/scripts/main.min.js']
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
          cwd: 'assets/images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'assets/images/'
        }]
      }
    },

    clean: {
      dist: {
        src: ['assets/styles', 'assets/scripts']
      }
    },

    watch: {
      scripts: {
        files: ['components/**/*.js', 'utils/scripts/*.js'],
        tasks: ['webpack:dev']
      },
      sass: {
        files: ['components/**/*.sass', 'utils/styles/*.sass', 'utils/styles/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
      },
      pug: {
        files: ['pug/*.pug', 'components/**/*.pug'],
        tasks: ['pug:compile'],

      },
      options: {
        spawn: false,
        pretty: true
      }
    },
    concurrent: {
      dev:        ['webpack:dev', 'sass:dev'],
      dev_prefix: ['postcss:dev'],
      dev_watch:  
      {
        tasks:    ['watch:scripts', 'watch:sass', 'watch:pug'],
        options:  {
          logConcurrentOutput: true
        },
      },

      prod:       {
        tasks: ['watch:scripts', 'watch:sass'],
        options: {
          logConcurrentOutput: true
        },
      },

      build:      ['webpack:prod', 'sass:dist'],
      minimal:    ['uglify:dist','postcss:dist'],
    }
  });
  grunt.registerTask('dev',  ['concurrent:dev', 'concurrent:dev_prefix', 'browserSync', 'concurrent:dev_watch']);

  grunt.registerTask('prod', ['concurrent:prod']);

  grunt.registerTask('build', ['clean:dist', 'concurrent:build','concurrent:minimal']);

  grunt.registerTask('optimal', ['imagemin']);
  grunt.registerTask('test',    ['mocha']);
  grunt.registerTask('default', ['dev']);
};