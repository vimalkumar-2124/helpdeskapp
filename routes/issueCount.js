var express = require('express');
var router = express.Router();
const {mongoDb, dbName, dbUrl} = require('../config/dbConfig')
const {mongoose, issueModel, issueTypeModel} = require('../config/dbSchema')

mongoose.connect(dbUrl)


router.get('/issues-counts', async(req, res) => {
  try{
    let open = await issueModel.find({status:"Open"}).count()
    let inProgress = await issueModel.find({status:"In-Progress"}).count()
    let closed = await issueModel.find({status:"Closed"}).count()
    res.send({
      statusCode:200,
      message:"Issue counts",
      open,
      inProgress,
      closed
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
