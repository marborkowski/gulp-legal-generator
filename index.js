var through = require('through2');
var gutil = require('gulp-util');
var escapeRegexString = require('escape-regex-string');
var license = require('bower-license');

module.exports = function (config) {
    config = config || {};

    var startsWith,
        endsWith,
        find,
        transform,
        packagePath;

    startsWith = config.startsWith || '<!-- legal:open -->';
    endsWith = config.endsWith || '<!-- legal:close -->';
    packagePath = config.packagePath || '';

    find = new RegExp([escapeRegexString(startsWith), '?([.*\\S\\s]+)', escapeRegexString(endsWith)].join(''), 'igm');

    transform = function(file, encoding, callback) {
      	if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            var error = new gutil.PluginError('myPlugin', 'Streaming not supported');
            return callback(error);
        }

        var contents,
            output;

        contents = file.contents.toString('utf8');

        license.init(packagePath, function (licenseMap, err){
            if (!err) {
                console.log(licenseMap);
                var outputArray = [];
                var keys = Object.keys(licenseMap);

                keys.forEach(function (key) {
                    var obj = [];
                    var entry = licenseMap[key];

                    obj.push('<article>');
                    obj.push(['\t', '<h1>', key, '</h1>'].join(''));
                    obj.push(['\t', '<h2>', entry.homepage || 'unknown homepage', '</h2>'].join(''));
                    obj.push(['\t', '<span>Licenses: ', (entry.licenses || ['unknown']).join(), '</span>'].join(''));
                    obj.push('</article>');

                    outputArray.push(obj.join('\n'));
                });

                output = contents.replace(find, [startsWith, outputArray.join('\n'), endsWith].join('\n'));
                file.contents = new Buffer(output);
            }

            callback(null, file);
        });
    };

    return through.obj(transform);
};
