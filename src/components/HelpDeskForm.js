import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { BaseContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function HelpDeskForm() {
  let context = useContext(BaseContext)
  let [issueTypes, setIssueTypes] = useState([])
  let [name,setName] = useState("")
  let [email, setEmail] = useState("")
  let [mobile, setMobile] = useState("")
  let [issueType, setIssueType] = useState("")
  let [issueTitle, setIssueTitle] = useState("")
  let [issueDescription, setIssueDescription] = useState("")

  let navigate = useNavigate()

  let loadIssueTypes = async() => {
    let res = await axios.get(`${context.apiurl}/issue-types`)
    if(res.data.statusCode === 200){
      setIssueTypes(res.data.issueTypes)
    }
  }

  useEffect(() => {
    loadIssueTypes()
  }, [])
  
  let handleSubmit = async() => {
    console.log({name,
      email,
      mobile,
      issueType,
      issueTitle,
      issueDescription})
    let res = await axios.post(`${context.apiurl}/issues`,{
      name,
      email,
      mobile,
      issueType,
      issueTitle,
      issueDescription
    })
    if(res.data.statusCode === 200){
      navigate(`/success/${res.data.issue_id}`)
    }
  }

  return <>
  <div className='wrapper-title'>
    <h1>Help Desk</h1>
    <p>We are here to help you out !!</p>
  </div>
  <div className='wrapper-main mt-3'>
  <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name<sup style={{'color':'red'}}>*</sup></Form.Label>
        <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Email<sup style={{'color':'red'}}>*</sup></Form.Label>
        <Form.Control type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Mobile<sup style={{'color':'red'}}>*</sup></Form.Label>
        <Form.Control type="text" placeholder="Enter your mobile number" onChange={(e) => setMobile(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Issue Type<sup style={{'color':'red'}}>*</sup></Form.Label>
        <Form.Select onChange={(e) => setIssueType(e.target.value)}>
          {
            issueTypes.map((e,i) => {
              return <option value={e} key={i}>{e}</option>
            })
          }

        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Issue Title<sup style={{'color':'red'}}>*</sup></Form.Label>
        <Form.Control type="text" placeholder="Title" onChange={(e) => setIssueTitle(e.target.value)}/>
      </Form.Group>

      <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: '100px' }} onChange={(e)=>setIssueDescription(e.target.value)}
            />
        </FloatingLabel>
      <div className='mt-3' style={{'textAlign':'center'}}>

        <Button variant="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </div>
      <div style={{"textAlign":"center"}}>
            <Form.Text className="text-muted">
                <sup>*</sup>We'll never share your Personal Information with anyone else.<sup>*</sup>
            </Form.Text>
        </div>
    </Form>
  </div>
  
  
  </>
}

export default HelpDeskForm