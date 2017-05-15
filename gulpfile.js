var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var cssnano 	= require('gulp-cssnano');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var favicons    = require("gulp-favicons");

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Set the path variables
const paths = {
    js: 'assets/js',
    jsFiles: ['assets/js/*.js', 'assets/js/*/*.js'],
    scssFiles: ['_sass/*.scss', '_sass/*/*.scss'], 
    scss: ['_sass/style.scss'],
    jekyll: ['index.html', '_config.yml', '_config.dev.yml', '_posts/*','_pages/*', '_layouts/*', '_includes/*', 'assets/img/*']
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build', '--config', '_config.yml,_config.dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'js', 'jekyll-build'], function() {
    browserSync({
        port: 4000,
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _sass into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(paths.scss)
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 3 versions'], { cascade: true }))
				.pipe(cssnano())
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

/**
 * Compile js into both _site/js (for live injecting) and site (for future jekyll builds)
 */
gulp.task('js', function () {
    return gulp.src([
        paths.js + '/algoliasearch.js',
        paths.js + '/scripts.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/js'));
})

gulp.task('plugins-js', function () {
    return gulp.src([
        paths.js + '/plugins/*.js'
    ])
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/js'));
})


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.scssFiles, ['sass']);
    gulp.watch(paths.jsFiles, ['js']);
    gulp.watch(paths.jekyll, ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
