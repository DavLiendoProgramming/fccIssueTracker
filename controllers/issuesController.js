require('dotenv').config();
const { ObjectID } = require('mongodb');
const mongo = require('../db/mongo');

//Create an Issue
exports.createIssue = (req, res) => {
  let issue = req.body;
  issue.created_on = new Date();
  issue.updated_on = new Date();
  issue.open = true;

  try {
    if (!issue) {
      res.status(404).send();
    }
    mongo(async function (db) {
      await db.insertOne(issue);
      res.send(issue);
      console.log('success!');
    });
  } catch (e) {
    res.send({ error: e.message });
  }
};

//Get all issues
exports.getIssues = (req, res) => {
  try {
    mongo(async function (db) {
      let issues = await db.find({});
      res.send(issues);
      console.log('success!');
    });
  } catch (e) {
    res.send({ error: e.message });
  }
};

//Update an issue
exports.updateIssue = (req, res) => {
  try {
    mongo(async function (db) {
      console.log(req.body._id, 'body');
      let issue = await db.findOne({ _id: ObjectID(req.body._id) });
      console.log(issue, 'idduse');
      if (!issue) {
        return res.status(404).send();
      }
      if (req.body.issue_title !== '') {
        issue.issue_title = req.body.issue_title;
      }
      if (req.body.issue_text !== '') {
        issue.issue_text = req.body.issue_text;
      }
      if (req.body.assigned_to !== '') {
        issue.assigned_to = req.body.assigned_to;
      }
      if (req.body.status_text !== '') {
        issue.status_text = req.body.status_text;
      }
      if (req.body.open !== undefined) {
        issue.open = req.body.open;
      }
      issue.updated_on = new Date();
      issue.open = req.body.open;
      console.log('success!', issue);
      issue.save();
      return res.send(issue);
    });
  } catch (e) {
    return res.send({ error: e.message });
  }
};

//Delete issue
exports.deleteIssue = (req, res) => {
  try {
    mongo(async function (db) {
      let issue = await db.remove({ _id: ObjectID(req.body._id) });
      if (!issue) {
        res.status(404).send();
      }
      res.send(issue);
      console.log('success!');
    });
  } catch (e) {
    res.send({ error: e.message });
  }
};
