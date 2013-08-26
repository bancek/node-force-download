var assert = require('assert'),
    should = require('chai').should(),
    http = require('http'),
    express = require('express'),
    request = require('request'),
    forceDownload = require('..');

describe('forceDownload', function () {
    var app, server;

    beforeEach(function () {
        app = express();
        server = http.createServer(app).listen(3005);
    });

    afterEach(function () {
        server.close();
    });

    it('should set headers to force download', function (done) {
        app.get('/file.txt', function (req, res) {
            forceDownload('file.txt', res);

            res.send('file content');
        });

        request.get('http://localhost:3005/file.txt', function (err, res, content) {
            res.headers['content-length'].should.equal('12');
            res.headers['content-type'].should.equal('application/force-download');
            res.headers['content-disposition'].should.equal(
                'attachment; filename="file.txt"; filename*=UTF-8\'\'file.txt');

            content.should.equal('file content');

            done()
        });
    });

    it('should encode unicode characters', function (done) {
        app.get('/file.txt', function (req, res) {
            forceDownload('čšžČŠŽ.txt', res);

            res.send('file content');
        });

        request.get('http://localhost:3005/file.txt', function (err, res, content) {
            res.headers['content-disposition'].should.equal(
                'attachment; filename="??????.txt"; filename*='
                + 'UTF-8\'\'%C4%8D%C5%A1%C5%BE%C4%8C%C5%A0%C5%BD.txt');

            done()
        });
    });
});
