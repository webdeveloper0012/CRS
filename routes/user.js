var express = require('express');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://admin:admin123@ds117848.mlab.com:17848/crs';
const path = require('path');
var ObjectID = require('mongodb').ObjectID;
var app = express();

const multer = require('multer');

//router.use(express.bodyParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); 

const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');


// Check File Type
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

app.post('/addNewUser', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log('first err', err);
            res.send({
                msg: err
            });
        } else {
            let filename;
            if (req.file == undefined) {
                filename = "abc1.png";
            }
            else {
                filename = req.file.filename;
            }
            //} else {
            if (!addUser(req.body, filename)) {
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

function addUser(reqbody,filename) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userAccount').insertOne({
            first_n: reqbody.firstname, last_n: reqbody.lastname,
            email: reqbody.email, password: reqbody.password, username: reqbody.username,
            role: reqbody.type, confi_status: 'true', img_url: filename, date: datenow, updateDate: datenow, IsActive: true
        }, function (error, result) {
            if (error) {
                return false;
            }
            else {
                if (reqbody.type == "Student") {
                    addUserInfo(result.insertedId.toHexString());
                }
                else {
                    addCompanyInfo(result.insertedId.toHexString());
                }
                return true;
            }
        });
    });
}

app.post('/getLogin',  function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userAccount').find({ email: req.body.email, password: req.body.password, IsActive: true }).toArray(function (err, results) {
            res.send(results);
        })
    });
});

app.post('/addUser', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userAccount').insertOne({
            first_n: req.body.firstname, last_n: req.body.lastname,
            email: req.body.email, password: req.body.password,
            username: req.body.username, role: req.body.type,
            confi_status: 'true', img_url: 'abc1.png', date: datenow
        }, function (error, result) {
            if (error) {
                res.send([{ success: result.insertedCount, idm: "null"}]);
            }
            else {
                res.send([{ idm: result.insertedId, success: result.insertedCount }]);
            }
        });
    });
}); //not in use

app.post('/updateUserInfo', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userInfo').updateOne({ userid: ObjectID(req.body.userid) }, {
            $set: {
                name: req.body.name, cnicno: req.body.cnicno, cellno: req.body.cellno,
                fathername: req.body.fathername, fathercnicno: req.body.fathercnicno,
                fathercellno: req.body.fathercellno, profession: req.body.profession, dob: req.body.dob, address: req.body.address, aboutme: req.body.aboutme,
                 updateDate: datenow
            },
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

function addUserInfo(userId) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userInfo').insertOne({
            userid: ObjectID(userId),
            name: '', cnicno: '', cellno: '',
            fathername: '', fathercnicno: '',
            fathercellno: '', profession:'', dob: '', address: '', aboutme: '',
            date: datenow, updateDate: datenow, IsActive: true
        }, function (error, result) {
            if (error) {

            }
            else {

            }
        });
    });
}

app.get('/getAllStudent', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userAccount').find({ role: 'Student', confi_status: "true", IsActive: true }).count(function (ssw, count) {
            dbo.collection('userAccount').find({ role: 'Student', confi_status: "true", IsActive: true })
                .project({ first_n: 1, last_n: 1, email: 1, username: 1, img_url: 1, date: 1 }).limit(10).toArray(function (err, results) {
                    res.send({ count: count, resu: results });
        })
        });
        
    });
});

app.post('/getUserInfo', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userInfo').find({ userid: ObjectID(req.body.userid), IsActive: true })
            .project({ _id: 0, IsActive: 0, date: 0, updateDate: 0, userid: 0 })
            .toArray(function (error, results) {
                res.send(results);
            })
    });
});

app.post('/addUserEducation', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userEducation').insertOne({
            userid: ObjectID(req.body.userid), degreename: req.body.degreename,
            session: req.body.session, institute: req.body.institute,
            totalmarks: req.body.totalmarks, obtainedmarks: req.body.obtainedmarks,
            date: datenow, updateDate: datenow,IsActive:true
        }, function (error, result) {
            if (error) {
                res.send([{ resu: false}]);
            }
            else {
                res.send([{ resu: true}]);
            }
        });
    });
});

app.post('/getUserEducation', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userEducation').find({ userid: ObjectID(req.body.userid), IsActive: true })
            .project({ IsActive: 0, date: 0, updateDate: 0, userid: 0 })
            .toArray(function (error, results) {
                res.send(results);
            })
    });
});

app.post('/updateUserEducation', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userEducation').updateOne({ "_id": ObjectID(req.body.eduid) }, {
            $set: {
                degreename: req.body.degreename,
                session: req.body.session, institute: req.body.institute,
                totalmarks: req.body.totalmarks, obtainedmarks: req.body.obtainedmarks,updateDate: datenow
            },
        }, function (error, result) {
            if (error) {
                console.log("error");
                res.send([{ resu: false }]);
            }
            else {
                console.log("added");
                res.send([{ resu: true }]);
            }
        });
    });
});

app.post('/deleteUserEducation', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userEducation').remove({ "_id": ObjectID(req.body.eduid) }, function (error, result) {
            if (error) {
                res.send([{ resu: false }]);
            }
            else {
                res.send([{ resu: true }]);
            }
        });
    });
});

app.get('/getAllCompany', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userAccount').find({ role: 'Company', confi_status: "true", IsActive: true })
            .project({ first_n: 1, email: 1, username: 1, date: 1 }).toArray(function (err, results) {
                res.send(results);
            })
    });
});

app.post('/getFilterStudent', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        console.log(req.body);
        dbo.collection('userAccount').aggregate([
            {
                $lookup:
                    { from: 'userInfo', localField: '_id', foreignField: 'userid', as: 'UserInfo' }
            },
            { $lookup: { from: 'userEducation', localField: '_id', foreignField: 'userid', as: 'UserEducation' } }, {
                $match: {
                    $or: [{ first_n: { $regex:  req.body.name, $options: 'i' } },
                        { "UserInfo.cnicno": { $regex: req.body.name, $options: 'i' } },
                        { "UserInfo.cellno": { $regex: req.body.name, $options: 'i' } },
                        { "UserEducation.degreename": { $regex: req.body.name, $options: 'i' } },
                        { "UserEducation.institute": { $regex: req.body.name, $options: 'i' } }
                      ],
                    role: "Student",
                    IsActive: true
                }
            }
            , {
                $project:
                    {
                        first_n: 1,
                        last_n:1,
                        email: 1,
                        username: 1,
                        img_url: 1,
                        _id:1
                    }
            }
        ]).skip(req.body.activepage * 10 - 10).limit(10).toArray(function (error, result) {
                if (error) {
                    throw error
                };
                res.send(result);
        });
    });
});

app.post('/getFilterStudentCount', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userAccount').aggregate([
            {
                $lookup:
                    { from: 'userInfo', localField: '_id', foreignField: 'userid', as: 'UserInfo' }
            },
            { $lookup: { from: 'userEducation', localField: '_id', foreignField: 'userid', as: 'UserEducation' } }, {
                $match: {
                    $or: [{ first_n: { $regex: req.body.name, $options: 'i' } },
                        { "UserInfo.cnicno": { $regex: req.body.name, $options: 'i' }},
                        { "UserInfo.cellno": { $regex: req.body.name, $options: 'i' } },
                        { "UserEducation.degreename": { $regex: req.body.name, $options: 'i' } },
                        { "UserEducation.institute": { $regex: req.body.name, $options: 'i' } }
                    ],
                    role: "Student",
                    IsActive: true
                }
            },
            {
                $count: "totalCount"
            }

        ]).toArray(function (error, result) {
            if (error) {
                throw error
            };
            res.send(result);
        });
    });
});

app.post('/getStudentById', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        if (ObjectID.isValid(req.body.stuID)) {
            var dbo = db.db("crs");
            dbo.collection('userAccount').aggregate([
                {
                    $lookup:
                        { from: 'userInfo', localField: '_id', foreignField: 'userid', as: 'UserInfo' }
                },
                { $lookup: { from: 'userEducation', localField: '_id', foreignField: 'userid', as: 'UserEducation' } }, {
                    $lookup:
                        { from: 'userSkill', localField: '_id', foreignField: 'userid', as: 'UserSkill' }
                }, {
                    $match: {
                        _id: ObjectID(req.body.stuID),
                        role: "Student",
                        IsActive: true
                    }
                }
                , {
                    $project:
                        {
                            IsActive: 0,
                            password: 0,
                            role: 0,
                            confi_status: 0,
                            date: 0,
                            updateDate: 0,
                            "UserEducation.userid": 0,
                            "UserEducation.date": 0,
                            "UserEducation.updateDate": 0,
                            "UserEducation.IsActive": 0,
                            "UserInfo.userid": 0,
                            "UserInfo._id": 0,
                            "UserInfo.date": 0,
                            "UserInfo.updateDate": 0,
                            "UserInfo.IsActive": 0,
                            "UserSkill.date": 0,
                            "UserSkill.updateDate": 0,
                            "UserSkill.IsActive": 0,
                            "UserSkill.userid": 0
                        }
                }
            ]).toArray(function (error, result) {
                if (error) {
                    throw error
                };
                res.send(result);
            });
        }
        else {
            res.send([]);
        }
    });
});

app.post('/addSkill', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userSkill').insertOne({
            userid: ObjectID(req.body.userid),
            skillname: req.body.skillname,
            date: datenow,
            updateDate: datenow,
            IsActive: true
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

app.post('/getSkill', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var dbo = db.db("crs");
        dbo.collection('userSkill').find({ userid: ObjectID(req.body.userid), IsActive: true })
            .project({ IsActive: 0, date: 0, updateDate: 0, userid: 0 })
            .toArray(function (error, results) {
                res.send(results);
            })
    });
});

function addCompanyInfo(companyid) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('companyInfo').insertOne({
            companyid: ObjectID(companyid),
            companyname: '', since: '', empno: '',
            phoneno: '', faxid: '',
            websiteurl: '', comptype: '', aboutcomp: '', compaddress: '', vision: '',
            services: '', history: '', file:'',
            date: datenow, updateDate: datenow, IsActive: true
        }, function (error, result) {
            if (error) {
                //rtn false
            }
            else {
                //rtn true
            }
        });
    });
}

app.post('/deleteUserSkill', function (req, res, next) {
    mongo.connect(url, function (err, db) {
        var datenow = new Date();
        var dbo = db.db("crs");
        dbo.collection('userSkill').remove({ "_id": ObjectID(req.body.skillid) }, function (error, result) {
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
