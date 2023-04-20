var http = require("http");
var formidable = require("formidable");
var fs = require("fs");
var port=process.env.PORT||'8080';
http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var arr = Object.keys(files).map((key) => [files[key]]);

        for (const file of arr) {
          var oldpath = file[0].filepath;
          var originalFilename = file[0].originalFilename;
          var newpath = "./uploads/" + originalFilename;

          fs.rename(oldpath, newpath, function (err, data) {
            if (err) {
              throw err;
            }          
          });
        }

        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        res.writeHead(200, { "Content-type": "text/html" });
        res.write(`<h1>Загрузились ${newpath}</h1>`);
        console.log('res', res)
        res.end();

      });

    } else { // download/...
     
      let itemPatch =  req.url.slice(10);
      let item = `./uploads/${itemPatch}`;
      console.log("item", item);
      fs.access(item, fs.constants.F_OK, (err) => {
        //check that we can access  the file
        console.log(`${item} ${err ? "does not exist" : "exists"}`);
      });
     
      fs.readFile(item, function (err, content) {
        if (err) {
        
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.writeHead(404, { "Content-type": "text/html" });
          res.end("<h1>No such file</h1>");
        } else {
          //specify the content type in the response will be an image
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.writeHead(200, { "Content-type": "text/json" });
          res.end(content);
        }
      });
    }
  })
  .listen(port);
