import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';

const CONFIG = {
	DIR_SRC: 'app/src/',
	DIR_DIST: 'app/dist/',
	SRC_SASS: 'app/src/sass/**/*.scss',
	SRC_HTML: 'app/src/**/*.html',
	TARGET_JS: 'js/app.js'
};

/**
 * エラー時に通知を出して、監視を止めない
 */
function plumberNotify() {
	return plumber({ errorHandler: notify.onError('<%= error.message %>') });
}

/**
 * hmtlのコピー
 */
gulp.task('html', () => {
	gulp.src(CONFIG.SRC_HTML)
		.pipe(rename((path) => {
			const changedDirName = path.dirname.replace('html', '');
			path.dirname = changedDirName;
		}))
		.pipe(gulp.dest(CONFIG.DIR_DIST))
		.pipe(browserSync.reload({ stream: true }));
});

/**
 * JSビルド
 */
gulp.task('babelify', () => {
	browserify({
		entries: CONFIG.DIR_SRC + CONFIG.TARGET_JS,
		extensions: ['.js'],
		debug: true
	})
		.transform(babelify)
		.bundle()
		.on('error', (err) => {
			console.log(`Error : ${err.message}`);
			// this.emit("end");
		})
		.pipe(source(CONFIG.TARGET_JS))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(CONFIG.DIR_DIST))
		.pipe(browserSync.reload({ stream: true }));
});

/**
 * sassコンパイル
 */
gulp.task('sass', () => {
	return gulp.src([
		CONFIG.SRC_SASS,
		`!${CONFIG.DIR_SRC}/sass/**/_*/`
	])
		.pipe(sourcemaps.init())
		.pipe(plumberNotify())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: ['last 3 version', 'ie >= 9', 'Android 4.2']
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(`${CONFIG.DIR_DIST}css/`))
		.pipe(browserSync.reload({ stream: true }));
});

/**
 * ファイル監視
 */
gulp.task('watch', () => {
	gulp.watch(CONFIG.SRC_HTML, ['html']);
	gulp.watch(CONFIG.SRC_SASS, ['sass']);
	gulp.watch(`${CONFIG.DIR_SRC}**/*.js`, ['babelify']);
});

/**
 * ローカルサーバー起動
 */
gulp.task('server', () => {
	browserSync({
		server: {
			baseDir: CONFIG.DIR_DIST
		}
	});
});

gulp.task('build', ['babelify', 'html', 'sass']);
gulp.task('default', ['babelify', 'html', 'sass', 'watch', 'server']);
