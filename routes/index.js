var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  const ImagePaths = [];
  ImagePaths.push(path.join(__dirname, '../public/images/CombatSwap'));
  ImagePaths.push(path.join(__dirname, '../public/images/Mathemagician'));
  ImagePaths.push(path.join(__dirname, '../public/images/SpiritsOfTheJar'));

  let filelist = [];
  for(let i = 0; i < ImagePaths.length; i++){
	filelist.push([]);
  	let foundfiles = fs.readdirSync(ImagePaths[i]);
    	foundfiles.forEach(function (file) {
		console.log(file);
        	filelist[i].push(file);
    	});
  }
  console.log(filelist);
  res.render('index', { title: 'Toppling Titan Games', ScreenShots: filelist });
});

module.exports = router;
