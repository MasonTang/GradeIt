'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Test_DATABASE_URL } = require('../config');
const { BlogPost } = require('../models');
const { app, runServer, closeServer } = require('../server')

chai.use(chaiHttp)

function seedBlogData() {
    console.info('seeding blogpost data')
    const seedData = [];

    for (let i = 0; i <= 10; i++) {
        seedData.push(generateBlogData());
    }
    return BlogPost.insertMany(seedData)
}