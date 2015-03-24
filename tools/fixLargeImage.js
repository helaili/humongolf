var ballCursor = db.balls.find({'images.large' : {$exists : false}}, {_id : 1, benchmarks:  1, fullname : 1});

while(ballCursor.hasNext()) {
  var ball = ballCursor.next();
  if(ball.benchmarks.length > 0) {
    var img = null;
    for(var bCounter = 0; bCounter < ball.benchmarks.length; bCounter++) {
      var importedBall = db.importedBalls.findOne({_id : ball.benchmarks[bCounter].ball});
      img = importedBall.images.large;
      if(img != null) {
        break;
      }
    }
    if(img != null) {
      db.balls.update({'_id' : ball._id}, {'$set' : {'images.large' : img}});
    } else {
      print('not found', ball.fullname);
    }
  }
}
