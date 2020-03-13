const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const app = express();

const PORT = 8080;
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/form', function (req, res) {
  res.sendFile(__dirname + '/form.html');
});

// default options
app.use(fileUpload());
app.use(morgan('tiny'));

app.use('/public', express.static(__dirname + '/public'));

app.get('/json', function (req, res) {
  const accessToken = req.query.accessToken;

  switch (accessToken) {
    case "efac5229-0595-41e9-b1aa-7df406539b87":
      res.sendFile(__dirname + '/public/json/efac5229-0595-41e9-b1aa-7df406539b87.json');
      break;
    case "9c7101f7-9c47-4481-b4da-a6a497abde08":
      res.sendFile(__dirname + '/public/json/9c7101f7-9c47-4481-b4da-a6a497abde08.json');
      break;
    case "2c48eb32-a0a8-405c-ade9-eed130605cba":
      res.sendFile(__dirname + '/public/json/2c48eb32-a0a8-405c-ade9-eed130605cba.json');
      break;
    default:
      res.status(400).send('Incorrect token');
  }
});

app.post('/upload', function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files);

  sampleFile = req.files.file;

  uploadPath = __dirname + '/uploads/' + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded to ' + uploadPath);
  });
});

app.listen(PORT, function () {
  console.log('Express server listening on port ', PORT);
});
