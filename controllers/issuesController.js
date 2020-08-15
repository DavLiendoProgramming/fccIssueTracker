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
  mongo(async function (db) {
    try {
      let issues = await db.find({}).toArray();
      return res.send(issues);
    } catch (e) {
      return res.send({ error: e.message });
    }
  });
};

//Update an issue
exports.updateIssue = (req, res) => {
  mongo(async function (db) {
    try {
      let issue = {};
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
      console.log(req.body._id);
      const result = await db.updateOne(
        { _id: ObjectID(req.body._id) },
        { $set: issue },
        { upsert: false }
      );
      console.log(result);
      console.log('success!');
      return res.send('Successfully updated ' + req.body._id);
    } catch (e) {
      return res.send({ error: e.message });
    }
  });
};

//Delete issue
exports.deleteIssue = (req, res) => {
  //ID string verify
  const reg = /^(.{12}|[0-9a-fA-f]{24})$/;
  if (!reg.test(req.body._id)) {
    return res.send('_id error');
  }
  try {
    mongo(async function (db) {
      let issue = await db.deleteOne({ _id: ObjectID(req.body._id) });
      if (!issue) {
        return res.status(404).send();
      }
      console.log('success!');
      return res.send('deleted ' + req.body._id);
    });
  } catch (e) {
    return res.send('could not delete ' + req.body._id);
  }
};
