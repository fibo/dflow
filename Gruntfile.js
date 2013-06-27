
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    ,
    browserify: {
      'client/js/dflow.js': ['lib/*.js']
    }
  })

  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['browserify'])
}

