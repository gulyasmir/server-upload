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
          var newpath = "./uploads/" + file[0].originalFilename;
          fs.rename(oldpath, newpath, function (err, data) {
            if (err) {
              throw err;
            }
          });
        }
      });

      return "ok";
    } else if (req.url == "/download") {
      let img = "./uploads/setting-mapRUS.json";
      console.log("img", img);
      fs.access(img, fs.constants.F_OK, (err) => {
        //check that we can access  the file
        console.log(`${img} ${err ? "does not exist" : "exists"}`);
      });

      fs.readFile(img, function (err, content) {
        if (err) {
          res.writeHead(404, { "Content-type": "text/html" });
          res.end("<h1>No such image</h1>");
        } else {
          //specify the content type in the response will be an image
          res.writeHead(200, { "Content-type": "text/json" });
          res.end(content);
        }
      });
    } else {
      console.log("req.url", req.url);
      let itemPatch =  req.url.slice(10);
      let item = `./uploads/${itemPatch}`;
      console.log("item", item);
      fs.access(item, fs.constants.F_OK, (err) => {
        //check that we can access  the file
        console.log(`${item} ${err ? "does not exist" : "exists"}`);
      });
     
      fs.readFile(item, function (err, content) {
        if (err) {
          let mapRUS = "./uploads/setting-mapRUS.json";
          fs.access(mapRUS, fs.constants.F_OK, (err) => {
            //check that we can access  the file
            console.log(`${item} ${err ? "does not exist" : "exists"}`);
          });
          fs.readFile(mapRUS, function (err, content) {
            if (err) {
              let img = "./uploads/setting-mapRUS.json";
              res.writeHead(404, { "Content-type": "text/html" });
              res.end("<h1>No such image</h1>");
            } else {
              //specify the content type in the response will be an image
              res.setHeader('Access-Control-Allow-Headers', '*');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.writeHead(200, { "Content-type": "text/json" });
              res.end(content);
            }
          });
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
