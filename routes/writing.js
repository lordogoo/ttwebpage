var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('writing',{ submenu : "writing" });
});

/***************************************************
focused space
****************************************************/
router.get('/FocusedSpace', function(req, res, next) {
  res.render('writing/FocusedSpace/FocusedSpace',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/Rules', function(req, res, next) {
  res.render('writing/FocusedSpace/Rules',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/Setting', function(req, res, next) {
  res.render('writing/FocusedSpace/Setting',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/Technology', function(req, res, next) {
  res.render('writing/FocusedSpace/Technology',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/urrungon', function(req, res, next) {
  res.render('writing/FocusedSpace/urrungon',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/human', function(req, res, next) {
  res.render('writing/FocusedSpace/human',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/miiloth', function(req, res, next) {
  res.render('writing/FocusedSpace/miiloth',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/anotites', function(req, res, next) {
  res.render('writing/FocusedSpace/anotites',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/chamboric', function(req, res, next) {
  res.render('writing/FocusedSpace/chamboric',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/nullbeta', function(req, res, next) {
  res.render('writing/FocusedSpace/nullbeta',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/rabanive', function(req, res, next) {
  res.render('writing/FocusedSpace/rabanive',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/youreen', function(req, res, next) {
  res.render('writing/FocusedSpace/youreen',{ submenu : "writing", subsubmenu : "focusedspace" });
});

router.get('/FocusedSpace/tzizet', function(req, res, next) {
  res.render('writing/FocusedSpace/tzizet',{ submenu : "writing", subsubmenu : "focusedspace" });
});

/***************************************************
synod
****************************************************/
router.get('/Synod', function(req, res, next) {
  res.render('writing/Synod/Synod',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Rules', function(req, res, next) {
  res.render('writing/Synod/Rules',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Setting', function(req, res, next) {
  res.render('writing/Synod/Setting',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Technology', function(req, res, next) {
  res.render('writing/Synod/Technology',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Eye', function(req, res, next) {
  res.render('writing/Synod/Eye',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Hand', function(req, res, next) {
  res.render('writing/Synod/Hand',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Tounge', function(req, res, next) {
  res.render('writing/Synod/Tounge',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Pluralism', function(req, res, next) {
  res.render('writing/Synod/Pluralism',{ submenu : "writing", subsubmenu : "synod" });
});

router.get('/Synod/Polarism', function(req, res, next) {
  res.render('writing/Synod/Polarism',{ submenu : "writing", subsubmenu : "synod" });
});

module.exports = router;