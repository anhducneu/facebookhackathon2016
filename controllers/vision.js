var config = require('../config');
var express = require('express');
var Vision = require('@google-cloud/vision');

var app = express();
var vision = Vision();
var router = express.Router();

/**
 * Uses the Vision API to detect labels in the given file.
 */
function detectLabels (inputFile, callback) {
    // Make a call to the Vision API to detect the labels
    vision.detectLabels(inputFile, { verbose: true }, function (err, labels) {
        if (err) {
            return callback(err);
        }
        console.log('result:', JSON.stringify(labels, null, 2));
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

            if (err) {
                res.status(500).send({
                    'exist': false,
                    'label': null
                });
            }

            // callback(null, labels.toString());

            //@todo: if else tree or not

            var labels = response.map(function(label){
                return label.desc;
            });

            res.status(200).send({
                'exist': checkIntersection(labels, config.treelist),
                'label': labels
            });

        });
    }catch(e){
        res.status(500).send({
            'exist': false,
            'label': null
        });
    }

});

module.exports = router;