var config = require('../config');
var express = require('express');
var Vision = require('@google-cloud/vision');
var mysql = require('mysql');

var app = express();
var vision = Vision();
var router = express.Router();


var connection = mysql.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.username,
    password : config.mysql.password,
    database : config.mysql.dbname
});

/**
 * Uses the Vision API to detect labels in the given file.
 */
function detectLabels (inputFile, callback) {
    // Make a call to the Vision API to detect the labels
    vision.detectLabels(inputFile, { verbose: true }, function (err, labels) {
        if (err) {
            return callback(err);
        }
        // console.log('result:', JSON.stringify(labels, null, 2));
        callback(null, labels);
    });
}

function main (inputFile, callback) {
    detectLabels(inputFile, function (err, labels) {
        if (err) {
            return callback(err);
        }

        console.log('Found label: ' + labels[0].desc + ' for ' + inputFile);
        callback(null, labels);
    });
}

function checkIntersection(array1, array2){

    var arrays = [
        array1,
        array2
    ];

    var result = arrays.shift().filter(function(v) {
        return arrays.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    });

    return result.length ? true:false;

}


router.get('/tree/exist', function(req, res) {

    var imageUrl = req.query.url;

    console.log("imageUrl: " + imageUrl);

    try {
        detectLabels(imageUrl, function (err, response) {

            if (err || response == undefined) {
                res.status(500).send({
                    'exist': false,
                    'label': null
                });
            }else{

                var labels = response.map(function(label){
                    return label.desc;
                });

                res.status(200).send({
                    'exist': checkIntersection(labels, config.treelist),
                    'label': labels
                });
            }
        });
    }catch(e){
        res.status(500).send({
            'exist': false,
            'label': null
        });
    }

});


router.get('/tree/image', function(req, res) {

    var name = req.query.name;
    try{
        const ImagesClient = require('google-images');

        let client = new ImagesClient('003393513132183759152:dstncmhyl9g', 'AIzaSyA7n8ZpSWQPIwfPKT5_GN_24gealN7_29M');

        client.search(name).then(function (response) {
            //console.log(response);
            var images = response.map(function(image){
                return image.url;
            });

            res.status(500).send({
                'images': images
            });
        });
    }catch(e){
        res.status(500).send({
            'images': null
        });
    }

});


router.get('/tree/ads', function(req, res){

    var name = req.query.name;

    try {
        connection.query("SELECT name, description, contact, image from advertisement where keywords like ?", ['%' + name + '%'],  function (err, rows, fields) {
            if (err) {
                // throw err;
                res.status(500).send({
                    'advertisements': []
                });


            }else{
                // var advertiserments = rows.map(function(row){
                //     return {'name': row.RowDataPacket.name, 'description': row.RowDataPacket.description, 'contact': row.RowDataPacket.contact, 'image': row.RowDataPacket.image};
                // });

                res.status(200).send({
                    'advertisements': rows
                });

            }

        });
    }catch(e){
        res.status(500).send({
            'advertisements': []
        });
    }
});


module.exports = router;