import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import watch from 'gulp-watch'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import buffer from 'vinyl-buffer'
import minify from 'gulp-minify'
import imagemin from 'gulp-imagemin'
import sitemap from 'gulp-sitemap'
import cachebust from 'gulp-cache-bust'
import tildeImporter from 'node-sass-tilde-importer'
var autoprefixer = require('autoprefixer'); /*add*/


const server = browserSync.create()

const postcssPlugins = [
  cssnano({
    core: true,
    zindex: false,
    autoprefixer: {
      add: true,
      browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
    }
  })
]



gulp.task('styles-dev', () => {
  gulp.src('./src/scss/styles.scss')
    .pipe(sourcemaps.init({ loadMaps : true}))
    .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./docs/css/'))
    .pipe(server.stream({match: '**/*.css'}))
})

gulp.task('styles-build', () => {
  gulp.src('./src/scss/styles.scss')
    .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter
    }))
    .pipe(postcss(
      [
        cssnano({
          core: true,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
          }
        })
      ]
    ))
    .pipe(gulp.dest('./docs/css/'))
})

gulp.task('pug-dev', () =>
  gulp.src('./src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      basedir: './src/pug'
    }))
    .pipe(gulp.dest('./docs'))
)

gulp.task('pug-build', () =>
  gulp.src('./src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      basedir: './src/pug'
    }))
    .pipe(gulp.dest('./docs'))
)

gulp.task('scripts-dev', () =>
  browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '-min.js',
        min: '.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./docs/js'))
)

gulp.task('scripts-build', () =>
  browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '.js',
        min: '-min.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./docs/js'))
)

gulp.task('images-build', () => {
  gulp.src('./src/img/**/**')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('./docs/assets/img'))
})

gulp.task('images-dev', () => {
  gulp.src('./src/img/**/**')
    .pipe(gulp.dest('./docs/assets/img'))
})

gulp.task('sitemap', () => {
  gulp.src('./docs/**/*.html', {
    read: false
  })
    .pipe(sitemap({
      siteUrl: 'https://example.com' // remplazar por tu dominio
    }))
    .pipe(gulp.dest('./docs'))
})

gulp.task('dev', ['styles-dev', 'pug-dev', 'scripts-dev', 'images-dev'], () => {
  server.init({
    server: {
      baseDir: './docs'
    }
  })

  watch('./src/scss/**/**', () => gulp.start('styles-dev'))
  watch('./src/js/**/**', () => gulp.start('scripts-dev', server.reload))
  watch('./src/pug/**/**', () => gulp.start('pug-dev', server.reload))
  watch('./src/img/**/**', () => gulp.start('images-dev'))
})

gulp.task('cache', () => {
  gulp.src('./docs/**/*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('./docs'))
})


gulp.task('build', ['styles-build', 'pug-build', 'scripts-build', 'images-build', 'cache', 'sitemap'])
