'use strict';
const
    {src, dest, parallel, series} = require('gulp'),
    fs = require('fs'),
    gulp = require('gulp'),
    browserReload = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemap = require('gulp-sourcemaps'),
    nano = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    watch = require('gulp-watch')
;

const
    //Theme dev
    theme_name = 'theme_otip_vstu',
    dir_theme = 'wp-content/themes/' + theme_name + '/',
    path = {
        sass: dir_theme + 'sass/**/*.*',
        css: dir_theme,
        php: dir_theme + '**/*.php'
    },
    //Plugin dev
    plugin_name = 'staff_posttype',
    dir_plugin = 'wp-content/themes/' + plugin_name + '/',
    plugin = {
        sass: dir_plugin + 'styles/*.sass',
        css: dir_plugin + 'styles/',
        vendor_sass: dir_plugin + 'vendors/*.sass',
        vendor_styel: dir_plugin + 'vendors/'
    };

function browserSync() {
    browserReload.init(
        {
            proxy: {
                target: 'https://wp.pure/',
            },
            files: [path.php],
            port: 3002,
            https: {
                key: "../../userdata/config/cert_files/localhost/localhost-server.key",
                cert: "../../userdata/config/cert_files/localhost/localhost-server.crt",
            },
            notify: false
        }
    );
}

function theme__css() {
    return src(path.sass)
        .pipe(plumber(
            ({
                errorHandler: function (err) {
                    console.log(err.message);
                    this.emit('end');
                }
            })
        ))
        .pipe(debug({title: 'Compiles:'}))
        .pipe(sass({}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(sourcemap.init())
        .pipe(nano())
        .pipe(sourcemap.write('.'))
        .pipe(dest(path.css))
}

function staff__css() {
    return src(plugin.sass, plugin.vendor_sass)
        .pipe(plumber(
            ({
                errorHandler: function (err) {
                    console.log(err.message);
                    this.emit('end');
                }
            })
        ))
        .pipe(debug({title: 'Compiles:'}))
        .pipe(sass({}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(sourcemap.init())
        .pipe(nano())
        .pipe(sourcemap.write('.'))
        .pipe(dest(plugin.css, plugin.vendor_styel))
}

function stream_theme() {
    watch(path.sass, parallel(theme__css,));
}

function stream_plugin() {
    watch(plugin.sass, parallel(staff__css));
    watch(plugin.vendor_sass, parallel(staff__css));
}

exports.browserReload = browserSync;
exports.theme__css = theme__css;
exports.staff__css = staff__css;
exports.stream_theme = stream_theme;
exports.stream_plugin = stream_plugin;
exports.defaults = parallel(stream_theme, browserSync);

