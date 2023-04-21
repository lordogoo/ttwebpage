var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('games',{ submenu : "games" });
});

/* Combat Swap */

router.get('/CombatSwap', function(req, res, next) {
  const CombatSwapImagePath = path.join(__dirname, '../public/images/CombatSwap');
  let filelist = [];
  fs.readdir(CombatSwapImagePath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        filelist.push(file);
    });
    res.render('games/combatSwap/CombatSwap',{ submenu : "games",subsubmenu : "combatswap", CombatSwapScreenShots: filelist });
  });
  
});

router.get('/CombatSwap/CombatSwapPrivacyPolicy', function(req, res, next) {
  res.render('games/combatSwap/CombatSwapPrivacyPolicy',{ submenu : "games",subsubmenu : "combatswap" });
});

/* Spirits Of The Jar */

router.get('/SpiritsOfTheJar', function(req, res, next) {
  res.render('games/spiritsofthejar/SpiritsOfTheJar',{ submenu : "games",subsubmenu : "spiritsofthejar" });
});

/* Mathmagician */

router.get('/Mathemagician', function(req, res, next) {
  const MathemagicianImagePath = path.join(__dirname, '../public/images/Mathemagician');
  let filelist = [];
  fs.readdir(MathemagicianImagePath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        filelist.push(file);
    });
    res.render('games/mathemagician/Mathemagician',{ submenu : "games",subsubmenu : "mathemagician", ScreenShots: filelist });
  });
});

module.exports = router;
