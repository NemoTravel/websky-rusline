(function () {

    var gulp = require('gulp'),
        del = require('del'),
        shell = require('gulp-shell'),
        ngHtml2Js = require('gulp-ng-html2js'),
        minifyHtml = require('gulp-minify-html'),
        uglify = require('gulp-uglify'),
        jshint = require('gulp-jshint'),
        jscs = require('gulp-jscs'),
        concat = require('gulp-concat'),
        stylus = require('gulp-stylus'),
        autoprefixer = require('autoprefixer-stylus'),
        browserify = require('browserify'),
        strictify = require('strictify'),
        source = require('vinyl-source-stream'),
        sourcemaps = require('gulp-sourcemaps'),
        buffer = require('vinyl-buffer'),
        lintFiles = ['src/**/*.js', '*.js'];

    gulp.task('clean', function () {
        return del('build');
    });

    gulp.task('jshint', function () {
        return gulp.src(lintFiles)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });

    gulp.task('jscs', function () {
        return gulp.src(lintFiles)
            .pipe(jscs())
            .pipe(jscs.reporter());
    });

    gulp.task('lint', gulp.parallel('jshint', 'jscs'));

    gulp.task('build:app:html', function () {
        return gulp.src('src/**/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(ngHtml2Js({
                moduleName: 'app',
                rename: function (url) {
                    return url.replace('src/', '');
                }
            }))
            .pipe(concat("templates-rusline.js"))
            .pipe(uglify())
            .pipe(gulp.dest('build/'));
    });

    gulp.task('build:app:js', function () {
        return browserify('src/index.js', {transform: strictify})
            .bundle()
            .pipe(source('controllers-rusline.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('build:app', gulp.series('build:app:html', 'build:app:js'));

    gulp.task('build:stylus:css', function () {
        return gulp.src('src/stylus/custom.styl')
            .pipe(stylus({
                'use': [autoprefixer('last 2 versions')],
                'include css': true,
                'pretty': true
            }))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('deploy', shell.task([process.env.DEPLOY_OXY_COMMAND]));

    gulp.task('watch', function () {
        if (process.env.DEPLOY_OXY_COMMAND) {
            gulp.watch('src/**/*.*', gulp.series('build:app', 'deploy'));
        } else {
            gulp.watch('src/**/*.*', gulp.series('build:stylus:css', 'build:app'));
        }
    });

    gulp.task('build', gulp.series(
        gulp.parallel(
            'clean',
            'lint'
        ),
        gulp.parallel(
            'build:app',
            'build:app:js',
            'build:stylus:css'
        )
    ));

    gulp.task('default', gulp.series('build', 'watch'));

}());
