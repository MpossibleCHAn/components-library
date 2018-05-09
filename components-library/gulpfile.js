const gulp = require('gulp');

const SRC = './src',
      DIST = './static',
      LESS_SRC = SRC + '/**/*.less',
      HTML = './**/*.html';

const less = require('gulp-less'),
      browserSync = require('browser-sync'),
      cleanCSS = require('gulp-clean-css'),
      changed = require('gulp-changed'),
      rename = require('gulp-rename'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps');

const reload = browserSync.reload;

gulp.task('less', () => {
  let options = {
    browsers:['last 5 versions'],
    cascade:true,
    remove:true
  };
  return gulp.src([LESS_SRC])
    .pipe(sourcemaps.init())
    .pipe(changed(DIST))
    .pipe(less())
    .pipe(autoprefixer(options))
    .pipe(cleanCSS())
    .pipe(rename( (path) => {
      path.dirname = path.dirname.replace('less','css');
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest(DIST))
    .pipe(reload({stream:true}))
})

gulp.task('default',['less'],() => {
  browserSync.init(null,{
    server: {
      baseDir: './', // 设置服务器的根目录
      index: 'src/index.html' // 指定默认打开的文件
    },
    port: 8050 // 指定访问服务器的端口号
  });
  gulp.watch([LESS_SRC], () => {
    gulp.run('less');
  })
})
