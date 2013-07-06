var connect = require('connect');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;
var database = null;

var mongostr = 'your connection string';

mongo.connect(mongostr, {}, function(error, db){       
		console.log("connected, db: " + db);

		database = db;

		database.addListener("error", function(error){
		console.log("Error connecting to MongoLab");

		});

	database.collection('tasks', {strict:true}, function(err, collection) {
		if (err) {
			console.log("The 'tasks' collection doesn't exist. Creating it with sample data...");
			populateDB();
		}
	});
});
exports.findAllTasks = function(req, res) {
	database.collection('tasks', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log('finding all ' + items.length + ' items');
			res.send(items);
		});
	});
};

exports.findTaskById = function(req, res) {
    var id = req.params.id;
    console.log('finding by: ' + id);
    database.collection('tasks', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			var oldPriority = item.oldPriority;
			updatePriority(oldPriority);
        });
    });
	
	function updatePriority(newPriority){
		
		 database.collection('tasks', function(err, collection) {
			collection.update({'_id':new BSON.ObjectID(id)}, {$set: {priority: newPriority, oldPriority: '', status: 'true'}}, {safe:true}, function(err, result) {
				if (err) {
					console.log('Error updating task: ' + err);
					res.send({'error':'An error has occurred'});
				} else {
					console.log('' + result + ' document(s) updated');
					res.send({'success': 'Task was updated!'});
				}
			});
		});
	}
	
};

exports.updateTask = function(req, res) {

    var id = req.params.id;
    var task = req.body;
	
    database.collection('tasks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, {$set: task}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating task: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send({'success': 'Task was updated!'});
            }
        });
    });
}

exports.addTask = function(req, res) {
	var task = req.body;
	console.log('Adding task: ' + JSON.stringify(task));
	database.collection('tasks', function(err, collection) {
		collection.insert(task, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.deleteTask = function(req, res) {
    var id = req.params.id;
	console.log('Deleting task: ' + id);
    database.collection('tasks', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {
 
	var todos = [
		{name: 'task 1', description: 'task description', priority: 'low', status: 'false'},
		{name: 'task 2', description: 'task description', priority: 'high', status: 'false'},
		{name: 'task 3', description: 'task description', priority: 'medium', status: 'false'},
		{name: 'task 4', description: 'task description', priority: 'low', status: 'true'}
	];
 
	database.collection('tasks', function(err, collection) {
		collection.insert(todos, {safe:true}, function(err, result) {
			console.log(err);
		});
	});
 
};