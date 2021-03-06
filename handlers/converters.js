const async = require("async");
const opt = require("../gateways/opt");
const utils = require("../helpers/utils");

function opt2html(req, res, next) {
    let uid = req.params.uid;
    opt.opt2html(uid, (err, html) => {
        if (err) {
            res.send(500, utils.buildRespose(false, null, "ERROR_OPT_CONVERTION"));
            return next(err);
        }
        res.send(200, utils.buildRespose(true, {html}));
        next();
    });
};

function opt2contribution(req, res, next) {
    let uid = req.params.uid;
    opt.opt2contribution(uid, (err, contribution) => {
        if (err) {
            res.send(500, utils.buildRespose(false, null, "ERROR_OPT_CONVERTION"));
            return next(err);
        }
        res.send(200, utils.buildRespose(true, {contribution}));
        next();
    });
};

function opt2bundle(req, res, next) {
    let uid = req.params.uid;
    async.parallel({
        html: (cb) => {
            opt.opt2html(uid, cb);
        },
        contribution: (cb) => {
            opt.opt2contribution(uid, cb);
        }
    }, (err, data) => {
        if (err) {
            res.send(500, utils.buildRespose(false, null, "ERROR_OPT_CONVERTION"));
            return next(err);
        }
        res.send(200, utils.buildRespose(true, data));
        next();
    })
}

function mergeContribution(req, res, next) {
    let body = req.body;
    opt.mergeContribution(body, (err, contribution) => {
        if (err) {
            res.send(500, utils.buildRespose(false, null, "ERROR_CONTRIBUTION_MERGE"));
            return next(err);
        }
        res.send(200, utils.buildRespose(true, {contribution}));
        next();
    })
};

module.exports = {opt2html, opt2contribution, opt2bundle, mergeContribution};
