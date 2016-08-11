var chai = require('chai');
var legal = require('..');
var expect = chai.expect;
var gulp = require('gulp');
var PluginError = require('gulp-util').PluginError;

// https://github.com/scniro/gulp-clean-css/blob/master/test/test.js
chai.should();

describe('gulp-clean-css: init', function () {

    it('should return the gulp-clean-css object: required export', function () {
        expect(legal).to.be.function;
    });
});

describe('gulp-clean-css: base functionality', function () {

    it('should allow the file through', function (done) {
        var i = 0;

        gulp.src('test/fixtures/template.html')
            .pipe(legal())
            .on('data', function (file) {
                i += 1;
            })
            .once('end', function () {
                i.should.equal(1);
                done();
            });
    });

    it('should produce the expected file', function (done) {
        /*var mockFile = new File({
            cwd: '/',
            base: '/test/',
            path: '/test/expected.test.css',
            contents: new Buffer('p{text-align:center;color:green}')
        });*/

        gulp.src('test/fixtures/template.html')
            .pipe(legal())
            .pipe(gulp.dest('test/fixturesx/'))
            .on('data', function (file) {
                file.contents.should.exist;
                done();
            });
    });

});
