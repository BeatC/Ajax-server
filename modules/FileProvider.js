/**
 * Created by beatc on 29.09.15.
 */
var fs = require('fs');


var FileProvider = function (path) {
    this.path = path;
    var that = this;

    fs.access(path, fs.R_OK | fs.W_OK, function (err, fd) {
        if (err) {
            console.log('No access to ' + path);
            return false;
        } else {
            that.fd = fd;
        }
    });
};


/***
 * Function saving json into the file described in file property of the instance
 * @param json
 * @returns {boolean}
 */
FileProvider.prototype.save = function (json, cb) {
    if (json) {
        fs.writeFile(this.path, json, typeof cb === 'function' ? cb : undefined);
    } else {
        return false;
    }
};


/***
 * Function loading all json from the file in path
 * @param cb - @param variable containing json
 * @returns {boolean}
 */
FileProvider.prototype.load = function (res, cb) {
    var tasksJSON;
    var that = this;

    if (typeof cb === 'function') {
        fs.readFile(this.path, function (err, data) {
            if (err) {
                console.log(err.message());
                res.status(500);
                res.end();
                return false;
            } else {
                tasksJSON = JSON.parse(data);
                cb(tasksJSON);
            }
        });
    } else {
        return false;
    }

};

FileProvider.prototype.close = function (res) {
    fs.close(this.fd, function (err) {
        if (err) {
            console.log("Unable to close file " + that.path);
            res.status(500);
            res.end();
        } else {
            console.log("File closed successfully");
        }
    });
}

module.exports = FileProvider;