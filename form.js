var http = require('http');
var qs = require('querystring');
var formidable = require('formidable');
var items = [];

var server = http.createServer(function(req, res) {
  if ('/' == req.url) {
    switch (req.method) {
      case 'GET':
        //show(res);
        showUpload(res);
        break;
      case 'POST':
        //add(req, res);
        upload(req, res);
        break;
      default:
        badRequest(res);
    }
  } else {
    notFound(res);
  }
});
server.listen(3000);

function show(res) {
  var html = '<html><head><title>To-do List</title></head><body>'
    + '<h1>To-do List</h1>'
    + '<ul>'
    + items.map(function(item) {
        return '<li>' + item + '</li>'
      }).join('')
    + '</ul>'
    + '<form method="post" action="/">'
    + '<p><input type="text" name="item" /></p>'
    + '<p><input type="submit" value="Add Item" /></p>'
    + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function showUpload(res) {
  var html = '<html><head><title>To-do List</title></head><body>'
    + '<h1>To-do List</h1>'
    + '<ul>'
    + items.map(function(item) {
        return '<li>' + item + '</li>'
      }).join('')
    + '</ul>'
    + '<form method="post" action="/" enctype="multipart/form-data">'
    + '<p><input type="text" name="name" /></p>'
    + '<p><input type="file" name="file" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}

function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  var form = new formidable.IncomingForm();
  form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
  });
  form.on('field', function(field, value) {
    console.log(field);
    console.log(value);
  });
  form.on('file', function(name, file) {
    console.log(name);
    console.log(file);
  });
  form.on('end', function() {
    res.end('Upload complete!');
  });
  form.parse(req);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

function badRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}

function add(req, res) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data',  function(chunk) { body += chunk});
  req.on('end',  function() {
    var obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}
