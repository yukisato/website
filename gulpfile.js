const { src, dest, parallel, watch } = require("gulp");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const imageminJpg = require("imagemin-jpeg-recompress");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const browserSync = require("browser-sync").create();

const html = () =>
  src("./src/*.html")
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("./dist"));

const css = () =>
  src("src/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "expanded"
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ grid: true }))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());

const image = () =>
  src("src/images/**/*.+(jpg|jpeg|png|gif)")
    .pipe(changed("./dist/images"))
    .pipe(
      imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
          interlaced: false,
          optimizationLevel: 3,
          colors: 180
        })
      ])
    )
    .pipe(dest("./dist/images"));

const watchFiles = () =>
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
watch("./src/*.html", html);
watch("./src/scss/**/*.scss", css);
watch("./src/images/**/*", image);
watch("./dist/**/*").on("change", browserSync.reload);

exports.html = html;
exports.css = css;
exports.image = image;
exports.watchFiles = watchFiles;
exports.default = parallel(html, css, image, watchFiles);
