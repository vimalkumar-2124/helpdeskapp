const mongoose = require('mongoose')
const validator = require('validator')

let issueSchema =new mongoose.Schema({
    name : {type:'string', required:true},
    email : {
        type:'string',
        required : true,
        lowercase : true,
        validate : (value) => {
            return validator.isEmail(value)
        }
    },
    mobile : { type:'string', required:true},
    issueType : {type:'string', required:true},
    issueTitle : {type:'string', required:true},
    issueDescription : {type:'string', required:true},
    status : {type:'string', default:'Open'},
    comments:{type:'string',default:"This issue will be addressed shortly!"},
    createdAt : {type:Date, default:Date.now()},
    inProgressDate:{type:Date, default:null},
    closedDate: {type:Date, default:null},
})

let issueTypeSchema = new mongoose.Schema({
    issue_type:{type:'string', required:true}
})

const issueModel = mongoose.model('issues', issueSchema)
const issueTypeModel = mongoose.model('issue-types', issueTypeSchema)

module.exports = {mongoose, issueModel, issueTypeModel}