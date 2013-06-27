
// TODO jade per generare l' html in modo he ci siano tutte le lib js 
// aggiungere anche jshint e watch

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    ,
    browserify: {
      'client/dflow.js': ['lib/*.js']
    }
    ,
    bower: {
      install: {
        options: {
	  cleanup: true,
	  layout: 'byType',
          targetDir: './client/lib'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['browserify'])
}

