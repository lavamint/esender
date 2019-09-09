var fs = require('fs')

// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//
var xpath = require('xpath'),
  domParser = require('xmldom').DOMParser,
  nodegrass = require('nodegrass'),
  ldap = require('ldapjs');
var request = require('request-promise');

//

var log = console.log.bind(console, '**** log: ')

var todoList = []

const ldapConfig = {
  options: {
    url: 'ldaps://bluepages.ibm.com'
  },
  baseDN: 'ou=bluepages,o=ibm.com',
  usernameAttribute: 'mail',
  groupMemberAttribute: 'uniquemember'
}

var authenticate = function(intranetId, password, callback) {
  if (intranetId && password && callback) {
    var ldapClient = ldap.createClient(ldapConfig.options);
    var opts = {
      filter: ldapConfig.usernameAttribute + '=' + intranetId,
      scope: 'sub',
      attributes: ['dn']
    };
    var userFound = false;
    ldapClient.search(ldapConfig.baseDN, opts, function(err, result) {
        // log(err, result, 'opts')
      result.on('searchEntry', function(entry) {
        if (!userFound) {
          userFound = true;
          var bindParams = entry['dn'];
          ldapClient.bind(bindParams, password, function(err) {
              // log(err, bindParams, password, 'psp')
            if (err) {
              callback(false);
            } else {
              callback(true);
            }
          });
        }
      });
      result.on('searchReference', function(referral) {
        console.log('referral: ' + referral.uris.join());
      });
      result.on('error', function(err) {
        callback(err, false);
      });
      result.on('end', function(result) {
        if (!userFound) {
          callback(false, false);
        }
      });
    });
  } else {
    var error = new Error('Invalid arguments');
    if (!callback) console.log(error);
    else callback(error, false);
  }
}

var  getUserInfo = function(userData, options, callback) {
  if (userData && options && options.constructor == Array && callback) {
    if (userData.email) {
      startProcess('preferredidentity=' + userData.email);
    } else if (userData.uid) {
      startProcess('uid=' + userData.uid);
    } else {
      var error = new Error('Invalid first argument');
      callback(error, false);
    }

    function startProcess(query) {
      var allowedAttributes = ['hrFirstName', 'hrLastName', 'name', 'preferredidentity', 'serialnumber', 'uid', 'jobresponsibilities', 'managerserialnumber', 'dept', 'employeecountrycode', 'employeetype', 'ismanager', 'mobile', 'co'];
      if (!options || options.length <= 0)
        options = allowedAttributes.slice();
        // log(options)
        nodegrass.get("https://bluepages.ibm.com/BpHttpApisv3/slaphapi?ibmperson/" + query + ".list/byxml", function(xmlData, status, headers) {
            var parsedData = new domParser().parseFromString(xmlData);
            var result = {};
            if (xpath.select('//attr', parsedData).length > 0) {
                if (options.indexOf('name') != -1) {
                    result['name'] = xpath.select("//attr[@name='givenname']/value", parsedData)[0].firstChild.data + ' ' + xpath.select("//attr[@name='sn']/value", parsedData)[0].firstChild.data;
                    options.splice(options.indexOf('name'), 1);
                }
                for (var i = 0; i < options.length; i++) {
                    if (allowedAttributes.indexOf(options[i]) != -1) {
                        if (xpath.select("//attr[@name='" + options[i] + "']", parsedData).length > 0) {
                            result[options[i]] = xpath.select("//attr[@name='" + options[i] + "']/value/text()", parsedData)[0].data;
                        } else {
                            result[options[i]] = '';
                        }
                    }
                }
                // log('failed', result)
                callback(result);
            } else {
                var error = new Error('User does not exist');
                callback(error, result);
            }
        }, 'utf8').on('error', function(e) {
            callback(e, false);
        });
    }
    } else {
        var error = new Error('Invalid arguments');
        if (!callback) console.log(error);
        else callback(error, false);
    }
}

// 配置静态文件目录
app.use(express.static('static_files'))
// 把前端发过来的数据自动用 json 去解析

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200); /让options请求快速返回/
    }  else {
        next();
    }
});

app.get('/', (request, response) => {
    const path = 'index.html'
    const options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        // 用 response.send 返回数据给浏览器
        // response.send(data) 这里的 data 是 ajax 里面的 r.response
        response.send(data)
    })
    // sendHtml(path, response)
})

var options = {
  method: 'POST',
  url: 'https://bluemail.w3ibm.mybluemix.net/rest/v2/emails',
  headers: {
    'cache-control': 'no-cache',
    'Authorization': 'Basic 这里需要用户名密码 省略',
    'content-type': 'application/json'
  },
  body: {
    contact: "sender@us.ibm.com",
    recipients: [{
      recipient: 'chenxyfr@cn.ibm.com'
    }],
    subject: 'hi',
    message: 'hi'
  },
  json: true
};

var mailSubject = 'Project Central - Alert Message';

var sendNotifications = function(body, callback) {

  options.body = body.data
  request(options, function(error, response, body) {
    if (error) {
      callback(error)
    } else {
      callback(response.headers)
      console.log("send notice to managers:", options.body.recipients);
    }
  });
}

var sendJSON = (response, data) => {
    var r = JSON.stringify(data, null, 2)
    // log('json', r)
    response.send(r)
}

var sendStatus = (response, status) => {
    // log('status', status)
    response.send(status)
}

var loginStatus = (form, response) => {
    var id = form.id
    var password = form.password
    authenticate(id, password, function(r) {
        // log(r, 'callback')
        // return r
        sendStatus(response, r)

    })
}

app.post('/todo/complete', (request, response) => {
    var form = request.body
    var status = loginStatus(form, response)
    // log(form, status, 'ididid')
    // sendStatus(response, status)
})

app.post('/send', (request, response) => {
    var body = request.body
    // log(body, 'form')
    sendNotifications(body, function(r){
        // log(body)
        sendStatus(response, r)
    })
})

app.post('/get/username', (request, response) => {
    var body = request.body.data
    // log(body, request)
    var a = {email:'chenxyfr@cn.ibm.com'}

    getUserInfo(body, [], function(r){
        sendJSON(response, r)
    })
})

var http = require('http');
var httpServer = http.createServer(app);
var port = 8000;
var host = 'localhost';

if (process.env.VCAP_APPLICATION) {
    var env = JSON.parse (process.env.VCAP_APPLICATION);
    console.log("diego env:",env);
    host = '0.0.0.0';
    port = process.env.PORT;
}

httpServer.listen(port, host, function() {
    console.log('HTTP Listening at ',host,port);
});
