var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cssnano 	= require('gulp-cssnano');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var favicons    = require('gulp-favicons');
var imagemin    = require('gulp-imagemin');
var size        = require('gulp-size');
var argv        = require('yargs').argv;
var htmlmin     = require('gulp-htmlmin');
var shell       = require('shelljs');
// var optipng     = require('imagemin-')

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Set the path variables
var paths = {};

paths.assetsSourceFolder = '_assets/'
paths.assetsOutputFolder = 'assets/'
paths.sassFolder = 'sass/'
paths.jsFolder = 'js/'
paths.imageFolder = 'img/'
paths.sourceFolder = ''

paths.sassFiles = paths.assetsSourceFolder + paths.sassFolder
paths.jsFiles = paths.assetsSourceFolder + paths.jsFolder
paths.imageFiles = paths.assetsSourceFolder + paths.imageFolder
paths.sassFilesOutput = paths.assetsOutputFolder + 'css/'
paths.jsFilesOutput = paths.assetsOutputFolder + paths.jsFolder
paths.imageFilesOutput = paths.assetsOutputFolder + paths.imageFolder

// Glob patterns by file type.
paths.sassPattern        = '**/*.scss';
paths.jsPattern          = '**/*.js';
paths.imagePattern       = '**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
paths.htmlPattern        = '**/*.html';

// File globs
paths.imageFilesGlob     = paths.imageFiles + paths.imagePattern
paths.jsFilesGlob        = paths.jsFiles + paths.jsPattern
paths.sassFilesGlob      = paths.sassFiles + paths.sassPattern

paths.jekyll =  ['index.html', '_config.yml', '_config.dev.yml', '_posts/*','_pages/*', '_layouts/*', '_includes/*']


/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    if (!argv.prod) {
        browserSync.notify(messages.jekyllBuild);
        shell.exec('bundle exec jekyll build --config _config.yml,_config.dev.yml')
        done();
        // return cp.spawn( jekyll , ['build', '--config', '_config.yml,_config.dev.yml'], {stdio: 'inherit'})
        //     .on('close', done);
    } else if (argv.prod) {
        shell.exec('JEKYLL_ENV=production bundle exec jekyll build')
        done();
    }
});

// 'gulp html' -- does nothing
// 'gulp html --prod' -- minifies and gzips HTML files for production
gulp.task('html', ['jekyll-build'], function() {
    if (argv.prod) {
        return gulp.src('_site/' + paths.htmlPattern)
            .pipe(htmlmin({
              removeComments: true,
              collapseWhitespace: true,
              collapseBooleanAttributes: false,
              removeAttributeQuotes: false,
              removeRedundantAttributes: false,
              minifyJS: true,
              minifyCSS: true
            }))
            .pipe(size({title: 'optimized HTML'}))
            .pipe(gulp.dest('_site/'));
    }
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['html'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('build', ['sass', 'jquery', 'plugins-js', 'js', 'images', 'html'], function () {
    if (!argv.prod) {
        browserSync({
            port: 4000,
            server: {
                baseDir: '_site'
            }
        })
    }
})

/**
 * Compile files from _sass into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(paths.sassFiles + 'style.scss')
        .pipe(sass({
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 3 versions'], { cascade: true }))
				.pipe(cssnano())
        .pipe(gulp.dest('_site/' + paths.sassFilesOutput))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(paths.sassFilesOutput))
        .pipe(size({title: 'sass'}));
});

/**
 * Compile js into both _site/js (for live injecting) and site (for future jekyll builds)
 */
gulp.task('js', function () {
    return gulp.src([
        paths.jsFiles + 'algoliasearch.js',
        paths.jsFiles + 'scripts.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_site/' + paths.jsFilesOutput))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(paths.jsFilesOutput))
        .pipe(size({title: 'js'}));
})

gulp.task('plugins-js', function () {
    return gulp.src([
        paths.jsFiles + 'plugins/*.js'
    ])
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_site/' + paths.jsFilesOutput))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(paths.jsFilesOutput))
        .pipe(size({title: 'js plugins'}));
})

// move jquery to assets folder
gulp.task('jquery', function() {
    return gulp.src([
        paths.jsFiles + 'jquery-1.11.2.min.js'
    ])
        .pipe(gulp.dest('_site/' + paths.jsFilesOutput))
        .pipe(gulp.dest(paths.jsFilesOutput))
})

// 'gulp images:optimize' -- optimize images
gulp.task('images', () => {
  return gulp.src([paths.imageFilesGlob])
    .pipe(imagemin([
      // imagemin.jpegtran({progressive: true}),
      imagemin.optipng()
      // imagemin.svgo({plugins: [{cleanupIDs: false}]})
    ], {verbose: true}))
    .pipe(gulp.dest('_site/' + paths.imageFilesOutput))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(paths.imageFilesOutput))
    .pipe(size({title: 'images'}));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.sassFilesGlob, ['sass']);
    gulp.watch(paths.jsFilesGlob, ['js']);
    gulp.watch(paths.imageFilesGlob, ['images'])
    gulp.watch(paths.jekyll, ['jekyll-rebuild']);
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['build', 'watch']);
