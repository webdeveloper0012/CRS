var express = require('express');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://admin:admin123@ds117848.mlab.com:17848/crs';
const path = require('path');
var ObjectID = require('mongodb').ObjectID;
var app = express();
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function (req, file, cb) {
        //cb(null, file.fieldname + '-' + Date.now() + file.originalname);
        console.log(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


app.post('/getCompanyInfo', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('companyInfo').find({ companyid: ObjectID(req.body.companyid), IsActive: true })
            .project({ _id: 0, IsActive: 0, date: 0, updateDate: 0, userid: 0, companyid:0})
            .toArray(function (error, results) {
                res.send(results);
            })
    });
});

app.post('/updateCompanyInfo', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log('first err', err);
            res.send({
                msg: err
            });
        } else {
            let filename;
            if (req.file == undefined) {
                //filename = "abc1.png";
       
            }
            else {
                filename = req.file.filename;
                updateCompanyFile(req.body.companyid, filename, req.body.oldfile);
            }
            //} else {
            if (!updateCompanyInfo(req.body)) {
                res.send({
                    msg: 'true',
                });
            } else {
                res.send({
                    msg: 'false',
                });
            }

            //}
        }
    });
});

function updateCompanyInfo(reqbody) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('companyInfo').updateOne({ companyid: ObjectID(reqbody.companyid) }, {
            $set: {
                companyname: reqbody.companyname, since: reqbody.since, empno: reqbody.empno,
                phoneno: reqbody.phoneno, faxid: reqbody.faxid,
                websiteurl: reqbody.websiteurl, comptype: reqbody.comptype, aboutcomp: reqbody.aboutcomp, compaddress: reqbody.compaddress,
                vision: reqbody.vision, services: reqbody.services, history: reqbody.history,
                updateDate: datenow
            },
        }, function (error, result) {
            if (error) {
                return false;
            }
            else {
                return true;
            }
        });


    });
}

function updateCompanyFile(compid, filename,oldfile) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('companyInfo').updateOne({ companyid: ObjectID(compid) }, {
            $set: {
                file: filename
            },
        }, function (error, result) {
            if (error) {
                return false;
            }
            else {
                deleteImage(oldfile);
                return true;
            }
        });


    });
}

function deleteImage(filename) {
    if (filename !=='abc1.png') {
        fs.unlink('public/images/' + filename, (err) => {
            if (err) throw err;
            console.log('successfully deleted /tmp/hello');
        });
    }
}

app.post('/addjob', function (req, res, next) {
    console.log(req.body);
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('jobs').insertOne({
            companyId: req.body.companyid, aboutu: req.body.about,
            responsibilities: req.body.responsibilities, skills: req.body.skills,
            reqList: req.body.reqlist,
            isActive: true, updatedate: datenow, date: datenow,
        }, function (error, result) {
            if (error) {
                res.send([{ resu: false }]);
            }
            else {
                res.send([{ resu: true }]);
            }
        });
    });
});

module.exports = app;