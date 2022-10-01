var express = require('express');
var router = express.Router();
const {mongoDb, dbName, dbUrl} = require('../config/dbConfig')
const {mongoose, issueModel, issueTypeModel} = require('../config/dbSchema')

mongoose.connect(dbUrl)


router.get('/issue-types', async(req, res) => {
  try{
    let issue_types = await issueTypeModel.find({},{'issue_type':1, '_id':0})
    let issueTypes = []
    issue_types.map((data) => {
        issueTypes.push(data.issue_type)
    })
    res.send({
      statusCode:200,
      message:"Find all the issue types",
      issueTypes
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

router.post('/issue-types', async(req, res) => {
  try{
    let issueType = await issueTypeModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Issue type added",
      issueType
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

router.put('/issue-types/:id', async(req,res) => {
    try{
        let issueType = await issueTypeModel.findOne({_id:mongoDb.ObjectId(req.params.id)})
        if(issueType){
            issueType.issue_type = req.body.issue_type
            await issueType.save()
            res.send({
              statusCode:200,
              message:"Issue edited successfully",
            })
        }
        else{
            res.send({
                statusCode:400,
                message:"Invalid issue type"
            })
        }
      }
      catch(err){
        console.log(err)
        res.send({
          statusCode:500,
          message:"Internal server error"
        })
    
      }
})

router.delete('/issue-types/:id', async(req,res) => {
    try{
        let issueType = await issueTypeModel.deleteOne({_id:mongoDb.ObjectId(req.params.id)})
        
        res.send({
              statusCode:200,
              message:"Issue type deleted successfully",
              deletedType : issueType
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
