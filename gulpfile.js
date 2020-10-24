const { src, dest, parallel, watch } = require("gulp");
const rename = require("gulp-rename");
const ejs = require("gulp-ejs");
const htmlmin = require("gulp-htmlmin");
const header = require("gulp-header");
const footer = require("gulp-footer");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const imageminJpg = require("imagemin-jpeg-recompress");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const browserSync = require("browser-sync").create();

const html = () =>
  src(["./src/ejs/**/*.ejs", "!" + "./src/ejs/**/_*.ejs"])
    .pipe(ejs({}, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("./docs"));

const css = () =>
  src("./src/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ grid: true }))
    .pipe(header("<style>"))
    .pipe(footer("</style>"))
    .pipe(rename("_style.ejs"))
    .pipe(dest("./src/ejs"))
    .pipe(browserSync.stream());

const js = () =>
  src("./src/js/**/*.js")
    .pipe(uglify())
    .pipe(header("<script>"))
    .pipe(footer("</script>"))
    .pipe(rename("_script.ejs"))
    .pipe(dest("./src/ejs"))
    .pipe(browserSync.stream());

const image = () =>
  src("src/images/**/*.+(jpg|jpeg|png|gif)")
    .pipe(changed("./docs/images"))
    .pipe(
      imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
          interlaced: false,
          optimizationLevel: 3,
          colors: 180,
        }),
      ])
    )
    .pipe(dest("./docs/images"));

const watchFiles = () =>
  browserSync.init({
    server: {
      baseDir: "./docs",
    },
  });
watch("./src/ejs/**/*.ejs", html);
watch("./src/scss/**/*.scss", css);
watch("./src/js/**/*.js", js);
watch("./src/images/**/*", image);
watch("./docs/**/*").on("change", browserSync.reload);

exports.html = html;
exports.css = css;
exports.js = js;
exports.image = image;
exports.watchFiles = watchFiles;
exports.default = parallel(css, js, html, image, watchFiles);
