module.exports = (grunt) ->
  grunt.initConfig
    watch:
      mochacli:
        files: ['test/*.js', 'lib/*.js']
        tasks: 'mochacli'
      docco:
        files: ['examples/*.js']
        tasks: 'docco'
      example:
        files: ['examples/*.js']
        tasks: ['mochacli', 'docco']
      jshint:
        files: ['index.js', 'lib/*js']
        tasks: 'jshint'
    docco:
      examples:
        src: ['examples/*.js']
        options:
          template: 'docs/docco.jst'
          output: 'docs'
          css: 'docco.css'
    mochacli:
      options:
        require: ['should']
        reporter: 'spec'
        bail: true
      all: ['test/*.js']

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-docco-multi'
  grunt.loadNpmTasks 'grunt-mocha-cli'

  grunt.registerTask 'default', ['mochacli']

