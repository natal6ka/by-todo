var express  = require('express'),
    path     = require('path'),
    http     = require('http'),
	fs       = require('fs')
	task     = require('./routes/tasks');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'app')));
});

// Bookmarks
app.get('/tasks', task.findAllTasks);
app.get('/tasks/:id', task.findTaskById);
app.put('/tasks/:id', task.updateTask);
app.post('/tasks', task.addTask);
app.delete('/tasks/:id', task.deleteTask);
	
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});