var express = require('express');
var fileProvider = require('../modules/FileProvider');
var router = express.Router();
var provider = new fileProvider('../json/tasks.json');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.sendfile('../assets/index.html', {root: __dirname })

});

/***
 * POST new task
 */
router.post('/task', function (req, res, next) {
  provider.load(res, function (json) {
    var maxId = parseInt(json[0].id);
    var newElement = JSON.parse(req.body.data);

    for (var i = 0, length = json.length; i < length; i++) {
      if (parseInt(json[i].id) > maxId) {
        maxId = parseInt(json[i].id);
      }
    }

    newElement.id = maxId + 1;
    json.push(newElement);
    provider.save(JSON.stringify(json), function (err) {
      if (err) {
        res.status(500);
      } else {
        res.status(200);
      }
      res.end();
    });
  });

});

/***
 * Edit created task
 */
router.put('/task', function (req, res, next) {
  var isExists = false;
  var substVar = JSON.parse(req.body.data);
  provider.load(res, function (json) {
    for (var i = 0, length = json.length; i < length; i++) {
      if (parseInt(json[i].id) === parseInt(substVar.id)) {
        json[i] = substVar;
        isExists = true;

        provider.save(JSON.stringify(json), function (err) {
          if (err) {
            res.status(500);
          } else {
            res.status(200);
          }
          res.end();
          return true;
        });
      }
    }

    if (!isExists) {
      res.status(400);
      res.end();
      return false;
    }

  })
});

router.delete('/task', function (req, res, next) {
  var isExists = false;
  var deleteVar = JSON.parse(req.body.data);
  provider.load(res, function (json) {
    for (var i = 0, length = json.length; i < length; i++) {
      if (json[i].id === deleteVar.id) {
        isExists = true;
        json.splice(i, 1);

        provider.save(JSON.stringify(json), function (err) {
          if (err) {
            res.status(500);
          } else {
            res.status(200);
          }
          res.end();
          return true;
        });
      }
    }

    if(!isExists) {
      res.status(400);
      res.end();
      return false;
    }
  });
});

router.get('/task', function (req, res, next) {
  provider.load(res, function (json) {
    res.status(200);
    res.send(json);
    res.end();
  });
});

module.exports = router;