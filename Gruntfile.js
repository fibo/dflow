
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    ,
    browserify: {
      'client/js/dflow.js': ['lib/*.js']
    }
    ,
    bower: {
      install: {
        options: {
          targetDir: './client'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['browserify'])
}

