fs = require('fs');
mysql = require('mysql')

var lastDate
var currentDate
var dataToWrite
var path = "logs/"




const parseIp = (req) =>
  (typeof req.headers['x-forwarded-for'] === 'string'
    && req.headers['x-forwarded-for'].split(',').shift())
  || req.connection?.remoteAddress


function getDate() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "-" + month + "-" + day;
}

function getTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min + ":" + sec;
}

function getFileName(date){
  var fileName = getDate()+"-click.log"
  return fileName
}



function writeFile(id,ip){



  currentDate = getDate()
  if (!lastDate){
    lastDate = getDate()
  }
  if(currentDate!==lastDate) {
    lastDate = currentDate
    dataToWrite = '\n IP: '+ip+'\n id: '+ id +'\n Date: '+currentDate+'\n Time: '+getTime()
    fs.writeFile(path+getFileName(lastDate), dataToWrite, function (err) {
      if (err) return console.log(err);
      console.log(`file ${getFileName(lastDate)}\n initialized with: \n ${dataToWrite}`);
    });
  } else {
    dataToWrite = '\n IP: '+ip+'\n id: '+ id +'\n Date: '+currentDate+'\n Time: '+getTime()
    fs.appendFile(path+getFileName(lastDate), dataToWrite, (err) => {
      if (err) throw err;
      console.log(`file ${getFileName(lastDate)} \n was appended data: ${dataToWrite}`);
    })
  }

}

function makeSQL(id,ip,datetime){
  var SQLValues = ' VALUES ('+id+','+ip+','+datetime +')'
  var SQLString = 'INSERT INTO click (`id_btn`, `ip`, `datetime`)'+SQLValues
  return SQLString; 
}

function makeConnectAndInsert(id,ip,datetime) {
  var con = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',  
    user: "root",  
    password: "root",  
    database: "dyisy"  
  })
  return con.connect(function(err){
    if(err) throw err;
    console.log("Connected");
    var sql = makeSQL(id,ip,datetime);
    con.query(sql, function(err,result){
      if (err) throw err;
      console.log("record inserted",id)
    })
    con.end(function(err) {
      console.log('connection ended')
    })
  })
}

module.exports.pressButton = function (req, res) {
  res.status(200).json({
    message: 'hi: ' ,
    id: req.params.id
  })
}

module.exports.create = async function (req, res) {
  ip = '"'+ parseIp(req)+'"'
  datetime = '"'+getDate()+getTime()+'"'
  id = req.body.id
 try {
   await makeConnectAndInsert(id,ip,datetime)
   await writeFile(id,ip)
   console.log("id: ", req.id)
 } catch (error) {
   console.log(error)
 }
}