'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://rich:abcdef1@cluster0-shard-00-00-lcwyq.mongodb.net:27017,cluster0-shard-00-01-lcwyq.mongodb.net:27017,cluster0-shard-00-02-lcwyq.mongodb.net:27017/gradeit?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
exports.Test_DATABASE_URL = process.env.Test_DATABASE_URL || 
'mongodb://mason:abcdef1@ds161074.mlab.com:61074/gradeit'
exports.PORT = process.env.PORT || 8080;