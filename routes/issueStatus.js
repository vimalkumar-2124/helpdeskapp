var express = require('express');
var router = express.Router();
const {mongoDb, dbName, dbUrl} = require('../config/dbConfig')
const {mongoose, issueModel, issueTypeModel} = require('../config/dbSchema')

mongoose.connect(dbUrl)


router.get('/issues-by-status/:status', async(req, res) => {
  try{
    let issues = await issueModel.find({status:req.params.status})
    res.send({
      statusCode:200,
      message:`${req.params.status} issues`,
      issues
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

router.put('/change-status/:id', async(req,res) =>{
    try{
        let issue = await issueModel.findOne({_id:mongoDb.ObjectId(req.params.id)})
        switch(issue.status){
            case 'Open':
                issue.status = 'In-Progress'
                issue.inProgressDate = new Date()
                break
            case 'In-Progress':
                issue.status = 'Closed'
                issue.closedDate = new Date()
                issue.comments = req.body.comments
                break
            default:
                res.send({
                    statusCode:400,
                    message:"Invalid current status"
                })
        }
        let result = await issue.save()
        res.send({
            statusCode:200,
            message:"Status changed successfully",
            result
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
