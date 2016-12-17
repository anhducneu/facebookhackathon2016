var express = require('express');
var morgan = require('morgan');
var app = express();
app.set('view engine', 'ejs');
app.use(morgan('combined'))



app.listen(3000, function () {
    console.log('App listening on port ' + 3000);
});



var Vision = require('@google-cloud/vision');
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/gcloud-node/#/docs/google-cloud/latest/guides/authentication

// Instantiate a vision client
var vision = Vision();

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

// Run the example
function main (inputFile, callback) {
    detectLabels(inputFile, function (err, labels) {
        if (err) {
            return callback(err);
        }

        console.log('Found label: ' + labels[0].desc + ' for ' + inputFile);
        callback(null, labels);
    });
}

if (module === require.main) {
    // if (process.argv.length < 3) {
    //     console.log('Usage: node labelDetection <inputFile>');
    //     process.exit(1);
    // }
    //
    //
    // var inputFile = process.argv[2];

    // var inputFile = "/Users/anhduc/Desktop/p.jpg";

    var inputFile = "http://bachhoagiare.com/sites/default/files/lam-dep-voi-hoa-hong-nhung.jpg";

    main(inputFile, console.log);
}

