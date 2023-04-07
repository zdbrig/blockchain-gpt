var express    = require("express");
var bodyParser = require('body-parser');
let commandroutes = require('./routes/commandroutes');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our dockerdashboard module apis' });
});

router.post('/execute-command',commandroutes.chatgpt );

app.use('/api', router);
app.listen(5050);