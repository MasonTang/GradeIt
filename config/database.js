'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/gradeit'
exports.Test_DATABASE_URL = process.env.Test_DATABASE_URL || 'mongodb://localhost/gradeit'
exports.PORT = process.env.PORT || 8080;