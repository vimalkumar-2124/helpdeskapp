import React, { useContext, useState } from 'react'
import { BaseContext } from '../App'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function Status() {
  let context = useContext(BaseContext)
  let [data, setData] = useState(null)
  let [ticket, setTicket] = useState("")

  let handleLoadTicket = async() => {
    let res = await axios.get(`${context.apiurl}/issues/${ticket}`)
    if(res.data.statusCode === 200){
      console.log(res.data)
      setData(res.data.issue)
    }
  }
  return <>
  <div className='col-5 mx-auto'>
  <Form>
    <Form.Group className="mb-3 mt-2">
        <Form.Label>Ticket Number<sup style={{"color":"red"}}>*</sup></Form.Label>
        <Form.Control type="text" placeholder="Enter Ticket Number"  onChange={(e)=>setTicket(e.target.value)}/>
      </Form.Group>
      <div className='mt-3' style={{"textAlign":"center"}}>
            <Button variant="primary" onClick={()=>handleLoadTicket()} >
                Submit
            </Button>
        </div>
    </Form>
    {
      data !== null ? <>
      <div style={{"textAlign":"left","paddingTop":"20px"}}>
        <h2 style={{"textAlign":"center"}}>Welcome to the Help Desk</h2>
        <h5><strong>Issue Title : </strong>{data.issueTitle}</h5>
        <div><strong>Issue Type :</strong> {data.issueType}</div>
        <div><strong>Issue Description :</strong> {data.issueDescription}</div>
        <div><strong>Status : </strong>
        <span style={data.status === "Open"?{"color":"red"} : data.status === "In-Progress" ? {"color":"#d4d435"} : {"color":"green"}}>{data.status}</span>
        <div><strong>Created At : </strong>{new Date(data.createdAt).toLocaleString()}</div>
        { data.status === "In-Progress" || data.status === "Closed" ? 
        <div><strong>Opened date : </strong>{new Date(data.inProgressDate).toLocaleString()}</div>
        :<></>}

        {
          data.status === "Closed" ?
          <div><strong>Closed date : </strong>{new Date(data.closedDate).toLocaleString()}</div>
          : <></>
        }
        <div><strong>Comment : </strong>{data.comments}</div>
        </div>
      </div> 
      </> : <></>
    }
  </div>
  </>
}

export default Status