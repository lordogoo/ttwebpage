var express = require('express');
var router = express.Router();
const querystring = require("querystring");
const mysql = require('mysql');
//const { Pool, Client } = require('pg');
const { v4: uuidv4 } = require("uuid");

/******************************
database
*******************************/
/*
//postgresql
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ttwebpage',
    password: 'civ3ptwe',
    port: 5432,
});
db.connect();
*/

//mysql
const db = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  //host: '68.66.226.123',
  //user: 'root',
  user: 'lordogoo_ttadmin',
  password: 'Civ3ptwe',
  database: 'lordogoo_ttwebpage'
  //database: 'ttwebpage'
});

db.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});
/*
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});
*/
/******************************
create tables
*******************************/

const queryCreateUserTable = `
CREATE TABLE IF NOT EXISTS users (
    userName varchar(500) primary key,
    email varchar(500) not null,
    password varchar(100) not null,
    admin boolean
);
`;
const queryCreatePostTable = `
CREATE TABLE IF NOT EXISTS posts (
    UUID BINARY(16) NOT NULL PRIMARY KEY,
    userName varchar(500),
    title varchar(500),
    whendate DATE NOT NULL DEFAULT(CURRENT_DATE),
    content text,
    ready boolean,
    CONSTRAINT fk_user_posts
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryDeletePostDefaultTrigger = `
DROP TRIGGER IF EXISTS post_uuiddefault;
`;

const queryCreatePostDefaultTrigger = `
CREATE TRIGGER post_uuiddefault
BEFORE INSERT ON posts
FOR EACH ROW
SET NEW.uuid = UUID_TO_BIN(UUID());
`;

const queryDeletePostTrigger = `
DROP TRIGGER IF EXISTS post_uuidtable;
`;

const queryCreatePostTrigger = `
CREATE TRIGGER post_uuidtable
AFTER INSERT ON posts
FOR EACH ROW
SET @last_uuid = NEW.uuid;
`;

const queryCreateFunctionUtoB = `
  CREATE FUNCTION IF NOT EXISTS UUID_TO_BIN(_uuid BINARY(36))
        RETURNS BINARY(16)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
    RETURN
        UNHEX(CONCAT(
            SUBSTR(_uuid, 15, 4),
            SUBSTR(_uuid, 10, 4),
            SUBSTR(_uuid,  1, 8),
            SUBSTR(_uuid, 20, 4),
            SUBSTR(_uuid, 25) ));
`;

const queryCreateFunctionBtoU = `
    CREATE FUNCTION IF NOT EXISTS BIN_TO_UUID(_bin BINARY(16))
        RETURNS BINARY(36)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
    RETURN
        LCASE(CONCAT_WS('-',
            HEX(SUBSTR(_bin,  5, 4)),
            HEX(SUBSTR(_bin,  3, 2)),
            HEX(SUBSTR(_bin,  1, 2)),
            HEX(SUBSTR(_bin,  9, 2)),
            HEX(SUBSTR(_bin, 11))
                 ));
`;

try {
    db.query(queryCreateFunctionUtoB);
    db.query(queryCreateFunctionBtoU);

    db.query(queryCreateUserTable);
    db.query(queryCreatePostTable);

    db.query(queryDeletePostDefaultTrigger);
    db.query(queryCreatePostDefaultTrigger);
    db.query(queryDeletePostTrigger);
    db.query(queryCreatePostTrigger);

    console.log('Table is successfully created');
} catch (err) {
    console.log(err.stack);
}

/******************************
sql queries
*******************************/

const userNumQuery = "Select count(userName) as count from users";
const userExistsQuery = "Select userName from users where userName = ?";
const userLoginQuery = "Select userName from users where userName = ? and password = ?";
const postQuery = "Select BIN_TO_UUID(UUID) as uuid,userName,title,DATE_FORMAT(whendate, '%Y-%m-%d') as whendate,content,ready from posts where userName = ? order by whendate";
const postQueryLimit = "Select BIN_TO_UUID(UUID) as uuid,userName,title,DATE_FORMAT(whendate,'%Y-%m-%d') as whendate,content,ready from posts where ready=true order by whendate DESC LIMIT ? OFFSET ?";
const postcountQuery = "Select count(whendate) as count from posts where ready=true";
const postcountbyuserQuery = "Select count(whendate) from posts where userName = ?";
const postQuerySingle = "Select BIN_TO_UUID(UUID) as uuid,userName,title,DATE_FORMAT(whendate,'%Y-%m-%d') as whendate,content,ready from posts where UUID = UUID_TO_BIN(?) and userName = ?";

const createUserInsert = 'Insert into users(email,userName,password,admin) values (?,?,?,?)';
const createPostInsert = 'Insert into posts(userName,title,whendate,content,ready) values (?,?,?,?,?);';
const createPostGetLast = 'select BIN_TO_UUID(@last_uuid) as uuid;';

const postUpdate = 'Update posts set title=?,whendate=?,content=?,ready=? where UUID=UUID_TO_BIN(?) and username=?';

const postDelete = "Delete from posts where UUID=UUID_TO_BIN(?) and username=?";

/******************************
new users
*******************************/

let tempUserID = [];

function tempUserIDExists(testID){
	for(let i = 0; i < tempUserID.length; i++){
		if(tempUserID[i].uuid == testID){
			return true
		}
	}
	return false;
}

/******************************
routes
*******************************/

router.get('/', function(req, res, next) {
  let pagesize = 5;
  if(req.query.page == undefined){
	db.query(postcountQuery,(err1, result1)=>{
		console.log(result1)
		let resultcount = typeof result1 !== 'undefined' ? result1[0].count : 0 ;
		let total = Math.ceil(resultcount/pagesize);
		let query2 = mysql.format(postQueryLimit,[pagesize,0]);
		db.query(query2,(err2, result2)=>{
			if(result2 != undefined){
				res.render('news',{ 'pagesize': pagesize, 'pagenumber': 1,'count': total, 'posts':result2});
			}else{
				res.render('news',{ 'pagesize': pagesize, 'pagenumber': 1, 'count': total});
			}
		});
	});
  }else{
	db.query(postcountQuery,(err1, result1)=>{
		console.log(req.query.page);
		let resultcount = typeof result1 !== 'undefined' ? result1[0].count : 0 ;
		let total = Math.ceil(resultcount/pagesize);
		let query2 = mysql.format(postQueryLimit,[pagesize,(req.query.page-1)]);
		db.query(query2,(err2, result2)=>{
			console.log(result2);
			if(result2 != undefined){
				res.render('news',{ 'pagesize': pagesize, 'pagenumber': req.query.page, 'count': total, 'posts':result2});
			}else{
				res.render('news',{ 'pagesize': pagesize,  'pagenumber': req.query.page,'count': total });
			}
		});
	});
  }
});

router.post('/exit', function(req, res, next) { 
  console.log("logout");

  if (req.session) {
    req.session.destroy(err => {
      if (err) {
	  let responsevalue = {'message': "<font color='red'>Unable to log out</font>"};
	  res.end(JSON.stringify(responsevalue));
      } else {
          let responsevalue = {'message': "<font color='green'>Logout succesfull</font>"};
  	  res.end(JSON.stringify(responsevalue));
      }
    });
  } else {
    let responsevalue = {'message': "<font color='green'>Logout succesfull</font>"};
    res.end(JSON.stringify(responsevalue));
  }

});

router.get('/login', function(req, res, next) {
  res.render('news/login');
});

router.post('/login', function(req, res, next) {
  if(req.body.username.trim() == ''){
	let responsevalue = {'message':"<font color='red'>User name field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.password.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Password field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }

  let query = mysql.format(userLoginQuery,[req.body.username.trim(),req.body.password.trim()]);
  db.query(query,(err, result)=>{

	if(err){
		let responsevalue = {'message':"<font color='red'>Database error</font>"};
		res.end(JSON.stringify(responsevalue));
	}else if(result.length == 0){
		let responsevalue = {'message':"<font color='red'>No match found for username and password combination</font>"};
		res.end(JSON.stringify(responsevalue));
	}else{
		let uuid = uuidv4();
		req.session.sessionID = uuid;
		req.session.user = result[0].userName;
    		req.session.save(function (err) {
      			if (err) return next(err)
			console.log("saved");
			let responsevalue = {
				'session': req.session.sessionID,
				'username': req.session.user,
				'message':"<font color='green'>Login succesfull</font>"
			};
			res.end(JSON.stringify(responsevalue));
    		});
	}
  });

});

router.get('/newuser', function(req, res, next) {
  db.query(userNumQuery,(err, result)=>{
	let resultcount = typeof result !== 'undefined' ? result[0].count : 0 ;
	if(resultcount == 0){
  		res.render('news/createuser');
	}else{
		//check if valid uuid
		if(tempUserIDExists(req.params.usercreateid)){
			res.render('news/createuser');
		}else{
			res.redirect('login');
		}
	}
  });
});

router.post('/newuser', function(req, res, next) {
  if(req.body.username.trim() == ''){
	let responsevalue = {'message':"<font color='red'>User name field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.email.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Password field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.password.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Password field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }

  db.query(userNumQuery,(err,result)=>{
	let usercount = typeof result !== 'undefined' ? result[0].count : 0 ;

  	if((!tempUserIDExists(req.params.usercreateid))&&(usercount != 0)){
		let responsevalue = {'message': "<font color='red'>Invalid UUID</font>"};
		res.end(JSON.stringify(responsevalue));
		return;
  	}
	let query = mysql.format(userExistsQuery,[req.body.username.trim()]);
	db.query(query,(err, result)=>{
		if(err != null){
			console.log(err);
			let responsevalue = {'message': "<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
		}else if(result.length == 0){
			let admin = false;
			if(usercount == 0){
				admin = true;
			}
			
			let input = [
				req.body.email.trim(),
				req.body.username.trim(),
				req.body.password.trim(),
				admin
			];
			console.log("insert query");
			let query2 = mysql.format(createUserInsert,input);
			db.query(query2,(err, result)=>{
				if(err == null){
					let responsevalue = {
						'message':"<font color='green'>User succesfully created</font>"
					};
					res.end(JSON.stringify(responsevalue));
				}else{
					let responsevalue = {
						'message':"<font color='red'>Database error</font>"
					}
					res.end(JSON.stringify(responsevalue));
				}
			});	
		}else{
			let responsevalue = {
				'message':"<font color='red'>Username already exists</font>"
			};
			res.end(JSON.stringify(responsevalue));
		}
	});
  });
});

router.get('/dashboard', function(req, res, next) {
	if (!req.session.user){
		res.redirect('login');
		return;
	}
	let query = mysql.format(postQuery,[req.session.user]);
	db.query(query,(err, result)=>{
		res.render('news/dashboard',{ Posts: result });
	});

});

router.get('/crud', function(req, res, next) {
	if (!req.session.user){
		res.redirect('login');
		return;
	}

	if(req.query.postid == undefined){
		res.render('news/crud',{mode:'new',username:req.session.user})
	}else{
		let query = mysql.format(postQuerySingle,[req.query.postid,req.session.user]);
		db.query(query,(err, result)=>{
			res.render('news/crud',{mode:'edit',username:req.session.user,post:result[0]})
		});	
	}
});

router.get('/preview', function(req, res, next) {
	if (!req.session.user){
		res.redirect('login');
		return;
	}
	let query = mysql.format(postQuerySingle,[req.query.postid,req.session.user]);
	db.query(query,(err, result)=>{
		res.render('news/preview',{post:result[0]})
	});
});

function generalError(err,db,res){
	console.log(err);
	db.rollback(function() {
		let responsevalue = {
			'message':"<font color='red'>Save Error</font>"
		};
		res.end(JSON.stringify(responsevalue));
	});
}

router.post('/crud', function(req, res, next) {
	if (!req.session.user){
		res.redirect('login');
		return;
	}

	if(req.body.uuid == ''){
		db.getConnection(function(err, connection) {
		connection.beginTransaction(function(err) {
        		if (err) {
            			generalError(err,db,res);
        		} else {
				let postvalues = [
					req.body.username,
					req.body.title,
					req.body.date,
					req.body.content,
					false
				];
				let query1 = mysql.format(createPostInsert,postvalues);
				connection.query(query1,(err, result)=>{
					if(err){
						generalError(err,db,res);
					}else{
						let query2 = mysql.format(createPostGetLast);
						connection.query(query2,(err, result)=>{
							if(err){
								generalError(err,db,res);
							}else{
								let uuidresult = result[0].uuid;
                    						connection.commit(function(err, result) {
                        						if (err) {
     										generalError(err,db,res);
                        						} else {
										let responsevalue = {
											'mode':'edit',
											'uuid':uuidresult,
											'message':"<font color='green'>Saved Succesfull</font>"
										};
										res.end(JSON.stringify(responsevalue));
                        						}
								});
							}
						});	
					}
				});
			}
		});
		});
	}else{
		console.log('update');
		let postvalues = [
			req.body.title,
			req.body.date,
			req.body.content,
			req.body.ready,
			req.body.uuid,
			req.body.username
		];
		let query = mysql.format(postUpdate,postvalues);
		db.query(query,(err, result)=>{
			if(err){
				let responsevalue = {
					'message':"<font color='red'>Save Error</font>"
				};
				res.end(JSON.stringify(responsevalue));
			}else{
				let responsevalue = {
					'message':"<font color='green'>Saved succesfull</font>"
				};
				res.end(JSON.stringify(responsevalue));
			}
		});
	}
});

router.post('/delete', function(req, res, next) {
	if (!req.session.user){
		res.redirect('login');
		return;
	}

	let postvalues = [
		req.body.uuid,
		req.session.user
	];
	let query = mysql.format(postDelete,postvalues);
	db.query(query,(err, result)=>{
		if(err){
			let responsevalue = {
				'message':"<font color='red'>Delete Error</font>"
			};
			res.end(JSON.stringify(responsevalue));
		}else{
			let responsevalue = {
				'message':"<font color='green'>Delete Succesfull</font>"
			};
			res.end(JSON.stringify(responsevalue));
		}
	});
});

module.exports = router;