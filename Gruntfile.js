'use strict';
var os = require('os');
var path = require('path');

module.exports = function (grunt) {
    // configure tasks
    grunt.initConfig({
        mocha_parallel: {
            options: {
                args: function(suiteName) {
                    return [];
                },
                env: function(suiteName) {
                    process.env.BROWSERNAME = grunt.option('browserName');
					process.env.APPIUMVERSION = grunt.option('appiumVersion');
					process.env.DEVICEORIENTATION = grunt.option('deviceOrientation');
					process.env.PLATFORMVERSION = grunt.option('platformVersion');
					process.env.PLATFORMNAME = grunt.option('platformName');
					process.env.DEVICENAME = grunt.option('deviceName');

                    return process.env;
                },
                report: function(suite, code, stdout, stderr) {
                    if (stdout.length) {
                      process.stdout.write(stdout);
                    }
                    if (stderr.length) {
                      process.stderr.write(stderr);
                    }
                },
                done: function(success, results) {
                },
                mocha: path.join('node_modules', '.bin', 'mocha') + (/win32/.test(os.platform()) ? '.cmd' : ''),
                //this is the default concurrency, change as needed.
                concurrency: os.cpus().length * 1.5
            }
        },

        parallel: {
            assets: {
                options: {
                    grunt: true
                },
                tasks: ['run_Android', 'run_Iphone']
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-mocha-parallel');
    grunt.loadNpmTasks('grunt-parallel');

    grunt.registerTask('Android', function(n) {
      grunt.option('browserName', 'Browser');
      grunt.option('appiumVersion', '1.5.3');
      grunt.option('deviceOrientation', 'portrait');
      grunt.option('deviceName', 'Android Emulator');
      grunt.option('platformVersion', '5.1');
      grunt.option('platformName', 'Android');
    });

    grunt.registerTask('Iphone', function(n) {
      grunt.option('browserName', 'Safari');
      grunt.option('appiumVersion', '1.6.3');
      grunt.option('deviceOrientation', 'portrait');
      grunt.option('platformVersion', '10.0');
      grunt.option('platformName', 'iOS');
      grunt.option('deviceName', 'iPhone Simulator');
    });

    // register tasks
    grunt.registerTask('default', ['parallel']);
    grunt.registerTask('run_Iphone', ['Iphone', 'mocha_parallel']);
    grunt.registerTask('run_Android', ['Android', 'mocha_parallel']);
};

