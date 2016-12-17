
const ImagesClient = require('google-images');

let client = new ImagesClient('003393513132183759152:dstncmhyl9g', 'AIzaSyA7n8ZpSWQPIwfPKT5_GN_24gealN7_29M');

client.search('Hoa giấy', {'size': 'medium'}).then(function (images) {
    console.log(images);
});
