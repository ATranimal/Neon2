/* eslint spaced-comment: ["error", "always", { "exceptions": ["/"] }] */
var express = require('express');
var fs = require('fs-extra');
var multer = require('multer');
const request = require('request');
const path = require('path');

var router = express.Router();
const __base = '';

const meiUpload = path.join(__base, 'public', 'uploads', 'mei');
const pngUpload = path.join(__base, 'public', 'uploads', 'png');
const iiifUpload = path.join(__base, 'public', 'uploads', 'iiif');

const allowedPattern = /^[-_\.,\d\w ]+$/;
const consequtivePeriods = /\.{2,}/;

function isUserInputValid (input) {
  return (input.match(allowedPattern) && !input.match(consequtivePeriods));
}

//////////////////
// Index routes //
//////////////////

// Main Page
router.route('/')
  .get(function (req, res) {
    var meiFiles = [];
    var iiifFiles = [];
    fs.readdir(meiUpload, function (err, files) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      if (files.length !== 0) {
        var index = files.indexOf('.gitignore');
        files.splice(index, (index < 0 ? 0 : 1));
        meiFiles = files;
      }

      fs.readdir(iiifUpload, { withFileTypes: true }, function (err, files) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        files.filter(entry => { return entry.isDirectory(); }).forEach(entry => {
          let label = entry.name;
          let revisions = fs.readdirSync(path.join(iiifUpload, label), { withFileTypes: true });
          revisions.filter(entry => { return entry.isDirectory(); }).forEach(entry => {
            if (err) {
              console.error(err);
              res.sendStatus(500);
            } else {
              iiifFiles.push([label, entry.name]);
            }
          });
        });
        if (meiFiles.length !== 0 || iiifFiles.length !== 0) {
          res.render('index', { 'files': meiFiles, 'iiif': iiifFiles });
        } else {
          res.render('index', { 'nofiles': 'No files uploaded', 'files': meiFiles, 'iiif': iiifFiles });
        }
      });
    });
  });

var upload = multer({
  storage: multer.memoryStorage(),
  limits: { filesize: 100000 }
});

router.route('/upload_file')
  .post(upload.array('resource', 2), function (req, res) {
    if (req.files[1].mimetype !== 'image/png') {
      res.sendStatus(400);
    }
    let files = [req.files[0].originalname, req.files[1].originalname];
    let meiSplit = files[0].split(/\.mei/, 2);
    let filename = meiSplit[0];
    let newImageName = filename + '.png';
    if (!isUserInputValid(files[0]) || !isUserInputValid(newImageName)) {
      res.sendStatus(403);
    }
    fs.writeFile(path.join(meiUpload, files[0]), req.files[0].buffer, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      fs.writeFile(path.join(pngUpload, newImageName), req.files[1].buffer, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        res.redirect('/');
      });
    });
  });

// Delete file TODO: Optimize function with regex
router.route('/delete/:filename')
  .get(function (req, res) {
    if (!isUserInputValid(req.params.filename)) {
      res.sendStatus(403);
    }
    var meifile = req.params.filename;
    var pngfile = meifile.split('.')[0] + '.png';
    // delete file from all folders
    fs.unlink(path.join(meiUpload), function (err) {
      if (err) {
        return console.log('failed to delete mei file');
      }
    });
    fs.unlink(path.join(pngUpload, pngfile), function (err) {
      if (err) {
        return console.log('failed to delete png file');
      }
    });
    res.redirect('/');
  });

// Delete IIIF files
router.route('/delete/:label/:rev').get((req, res) => {
  if (!isUserInputValid(req.params.label) || !isUserInputValid(req.params.rev)) {
    res.sendStatus(403);
  }
  let somePath = path.join(iiifUpload, req.params.label, req.params.rev);
  fs.remove(somePath, (err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// redirect to editor
router.route('/edit/:filename')
  .get(function (req, res) {
    if (!isUserInputValid(req.params.filename)) {
      res.sendStatus(403);
    }
    var mei = req.params.filename;
    var bgimg = mei.split('.', 2)[0] + '.png';
    var autosave = false;
    // Check that the MEI exists
    fs.stat(path.join(meiUpload, mei), (err, stats) => {
      if (err) {
        console.error("File of name '" + mei + "' does not exist.");
        res.status(404).render('error', { statusCode: '404 - File Not Found', message: 'The file ' + mei + ' could not be found on the server!' });
        return;
      }
      res.render('editor', { 'meifile': '/uploads/mei/' + mei, 'bgimg': '/uploads/png/' + bgimg, 'autosave': autosave });
    });
  });

// redirect to salzinnes editor
router.route('/edit-iiif/:label/:rev').get((req, res) => {
  if (!isUserInputValid(req.params.label) || !isUserInputValid(req.params.rev)) {
    res.sendStatus(403);
  }
  let pathName = path.join(req.params.label, req.params.rev);
  fs.readFile(path.join(iiifUpload, pathName, 'metadata.json'), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).render('error', { statusCode: '500 - Internal Server Error', message: 'Could not find the manifest for IIIF entry ' + pathName });
    } else {
      let metadata;
      try {
        metadata = JSON.parse(data.toString());
      } catch (e) {
        console.error(e);
        res.status(500).render('error', { statusCode: '500 - Internal Server Error', message: 'Could not parse entry metadata' });
      }
      let map = new Map();
      for (let page of metadata.pages) {
        let data;
        try {
          data = fs.readFileSync(path.join(iiifUpload, pathName, page.file));
        } catch (e) {
          console.error(e);
          continue;
        }
        map.set(page.index, data.toString());
      }
      res.render('editor', { 'manifest': metadata.manifest, 'meiMap': encodeURIComponent(JSON.stringify([...map])) });
    }
  });
});

router.route('/add-iiif').get(function (req, res) {
  res.render('add-iiif', {});
}).post(function (req, res) {
  if (req.body.manifest === undefined || req.body.revision === undefined) {
    res.render('add-iiif', { messages: 'All fields are required!' });
  } else {
    request(req.body.manifest, (error, response, body) => {
      if (error) {
        res.render('add-iiif', { messages: error });
      } else if (!response.statusCode === 200) {
        res.render('add-iiif', { messages: 'Received status code ' + response.statusCode });
      } else {
        let manifest;
        try {
          manifest = JSON.parse(body);
        } catch (e) {
          res.render('add-iiif', { messages: 'URL was not to a valid JSON object.' });
        }
        if (manifest['@context'] !== 'http://iiif.io/api/presentation/2/context.json' ||
            manifest['@type'] !== 'sc:Manifest') {
          res.render('add-iiif', { messages: 'URL was not to a IIIF Presentation manifest.' });
        }

        // Check if a revision for this already exists.
        let label = manifest.label;
        if (label === undefined) {
          res.status(400).render('error', {
            statusCode: '400 - Bad Request',
            message: 'The provided manifest does not have a label and cannot be processed.'
          });
        }
        if (!isUserInputValid(label) || !isUserInputValid(req.body.revision)) {
          res.sendStatus(403);
        }
        let directoryExists = true;
        try {
          fs.accessSync(path.join(iiifUpload, label, req.body.revision));
        } catch (e) {
          directoryExists = false;
        }
        if (directoryExists) {
          res.render('add-iiif', { messages: 'The revision specified already exists!' });
          return;
        }

        // Create appropriate directory
        fs.mkdir(path.join(iiifUpload, label, req.body.revision), (err) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          }
          fs.writeFile(path.join(iiifUpload, label, req.body.revision, 'metadata.json'),
            JSON.stringify({ manifest: req.body.manifest, pages: [] }),
            (err) => {
              if (err) {
                console.error(err);
                res.sendStatus(500);
              }
              res.render('add-mei-iiif', { label: label, rev: req.body.revision });
            });
        });
      }
    });
  }
});

router.route('/add-mei-iiif/:label/:rev').post(upload.array('mei'), function (req, res) {
  if (!isUserInputValid(req.params.label) || !isUserInputValid(req.params.rev)) {
    res.sendStatus(403);
  }
  // Get metadata
  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(path.join(iiifUpload, req.params.label, req.params.rev, 'metadata.json')));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

  // Get manifest
  request(metadata.manifest, (error, response, body) => {
    if (error) {
      res.send(error);
    } else if (!response.statusCode === 200) {
      res.status(response.statusCode).send(response.statusMessage);
    } else {
      let manifest;
      try {
        manifest = JSON.parse(body);
      } catch (e) {
        res.status(500).send('Could not parse the JSON object');
      }
      let labels = [];
      for (let sequence of manifest['sequences']) {
        for (let canvas of sequence['canvases']) {
          labels.push(canvas['label']);
        }
      }

      // Check file names for conflicts
      for (let i = 0; i < req.files.length; i++) {
        for (let j = i + 1; j < req.files.length; j++) {
          if (req.files[i].originalname === req.files[j].originalname) {
            res.render('add-mei-iiif', { label: req.params.label, rev: req.params.rev, message: 'Two files with the name ' + req.files[i].originalname + ' were selected.' });
          }
        }
      }

      // Store files and create array of file names
      let filenames = [];
      for (let file of req.files) {
        fs.writeFileSync(path.join(iiifUpload, req.params.label,
          req.params.rev, file.originalname), file.buffer);
        filenames.push(file.originalname);
      }

      // res.status(501).render('error', { statusCode: '501 - Not Implemented', message: 'Adding a IIIF manifest and MEI files is not fully supported yet. Sorry!' });
      res.render('associate-mei-iiif',
        {
          label: req.params.label,
          rev: req.params.rev,
          files: filenames,
          labels: labels
        }
      );
    }
  });
});

router.route('/associate-mei-iiif/:label/:rev').post(function (req, res) {
  if (!isUserInputValid(req.params.label) || !isUserInputValid(req.params.rev)) {
    res.sendStatus(403);
  }
  // Load metadata file
  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(path.join(iiifUpload, req.params.label, req.params.rev, 'metadata.json')));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

  // Update metadata
  metadata.pages = [];
  for (let entry of req.body.select) {
    metadata.pages.push(JSON.parse(entry));
  }

  fs.writeFile(path.join(iiifUpload, req.params.label, req.params.rev, 'metadata.json'), JSON.stringify(metadata), (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    res.redirect('/');
  });
});

module.exports = router;
