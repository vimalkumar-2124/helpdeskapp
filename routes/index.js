var express = require('express');
var router = express.Router();
const {mongoDb, dbName, dbUrl} = require('../config/dbConfig')
const {mongoose, issueModel, issueTypeModel} = require('../config/dbSchema')

mongoose.connect(dbUrl)


router.get('/issues/:id', async(req, res) => {
  try{
    let issue = await issueModel.findOne({_id:mongoDb.ObjectId(req.params.id)})
    res.send({
      statusCode:200,
      message:"Find the requested issue detail",
      issue
    })
  }
  catch(err){
    console.log(err)
    res.send({
      statusCode:500,
      message:"Internal server error"
    })

  }
})
router.post('/issues', async(req, res) => {
  try{
    let issue = await issueModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Issue raised successfully",
      issue_id:issue._id
    })
  }
  catch(err){
    console.log(err)
    res.send({
      statusCode:500,
      message:"Internal server error"
    })

  }
})

module.exports = router;
