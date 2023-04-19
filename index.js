var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var arr = Object.keys(files).map((key) => [files[key]]);
        
        for (const file of arr) {  
            var oldpath = file[0].filepath
            var newpath = './uploads/' +file[0].originalFilename
            fs.rename(oldpath, newpath, function (err, data) {
                if (err) {
                  throw err;
                } 
               
            });
          } 
 });


    return 'ok'
  } 

}).listen(8080);



