/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
require('dotenv').config();
const expect = require('chai').expect;
const express = require('express');
//MongoDB imports
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

//Controllers
const issuesController = require('../controllers/issuesController');

const CONNECTION_STRING = process.env.DB;
module.exports = function (app) {
  app.get('/api/issues/:project', issuesController.getIssues);

  app.post('/api/issues/:project', issuesController.createIssue);

  app.put('/api/issues/:project', issuesController.updateIssue);

  app.delete('/api/issues/:project', issuesController.deleteIssue);
};
