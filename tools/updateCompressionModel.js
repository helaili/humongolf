db.balls.update({$and : [{compression : {$exists : true}}, {compression : {$not : {$type : 3}}}]}, {$rename : {compression : 'compressionOld'}}, {multi : true})
db.balls.update({compressionOld : {$exists : true}}, {$rename : {compressionOld : 'compression.value'}}, {multi : true})
