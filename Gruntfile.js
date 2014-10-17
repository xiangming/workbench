module.exports = function(grunt){
	//项目配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
	            ' * Theme Name: <%= pkg.name %>\n' +
	            ' * Theme URI: <%= pkg.themeURI %>\n' +
	            ' * Description: <%= pkg.description %>\n' +
	            ' * Author: <%= pkg.author %>\n' + 
	            ' * Author URI: <%= pkg.authorURI %>\n' + 
	            ' * Version: <%= pkg.version %>\n' +
	            ' * © <%= grunt.template.today("yyyy") %> themes.xiguabaobao.com. All rights reserved.\n' +
	            ' */\n',
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			build: {
				files: {
					'js/base.min.js': [
						'assets/jquery/jquery-1.9.1.min.js',
						'assets/bootstrap/js/bootstrap.min.js'
					]
				}
			}
		},
		cssmin: {
			options: {
				banner: '<%= banner %>',
				keepSpecialComments: '0'
			},
			build: {
				files: {
					'css/base.min.css': [
						'assets/bootstrap/css/bootstrap.min.css'
					]
				}
			}
		},
		less: {
			build: {
				files: {
					'*/css/style.css': '*/css/style.less',
					'css/bubble.css': 'less/bubble.less',
					'css/sequence.css': 'less/sequence.less'
				}
			}
		},
		watch: {
			less: {
				files: ['*/css/*.less', 'less/*.less'],
				tasks: ['less']
			}
		}
	});
	//加载插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-csscomb');
	//制定任务
	grunt.registerTask('default',['uglify', 'less', 'cssmin']);
}