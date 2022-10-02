
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseContext } from '../App'

function Issues() {
    let context = useContext(BaseContext)
    let navigate = useNavigate()
    let params = useParams()
    let [data, setData] = useState(null)
    let [comment, setComment] = useState("")

    let handleLoadTicket = async() => {
        let res = await axios.get(`${context.apiurl}/issues/${params.id}`)
        if(res.data.statusCode===200){
            setData(res.data.issue)
            setComment(res.data.issue.comments)
        }
    }

    useEffect(() => {
        handleLoadTicket()
    },[])

    let nextStage = async() => {
        let res = await axios.put(`${context.apiurl}/change-status/${params.id}`,{
            comments:comment
        })
        if(res.data.statusCode===200){
            navigate('/dashboard')
        }
    }
  return<>
 <div className='col-5 mx-auto'>
 {
      data !== null ? <>
      <div style={{"textAlign":"left","paddingTop":"20px"}}>
        <h2 style={{"textAlign":"center"}}>Welcome to the Help Desk</h2>
        <h5><strong>Issue Title : </strong>{data.issueTitle}</h5>
        <div><strong>Issue Type :</strong> {data.issueType}</div>
        <div><strong>Issue Description :</strong> {data.issueDescription}</div>
        <div><strong>Status : </strong>
        <span style={data.status === "Open"?{"color":"red"} : data.status === "In-Progress" ? {"color":"#d4d435"} : {"color":"green"}}>{data.status}</span>
        <div><strong>Created Date : </strong>{new Date(data.createdAt).toLocaleString()}</div>
        { 
        data.status === "In-Progress" || data.status === "Closed" ? 
        <div><strong>Opened date : </strong>{new Date(data.inProgressDate).toLocaleString()}</div>
        :<></>
        }

        {
          data.status === "Closed" ?
          <div><strong>Closed date : </strong>{new Date(data.closedDate).toLocaleString()}</div>
          : <></>
        }
        <div><strong>Comment : </strong>
            <input type={"textArea"} value={comment} onChange={(e) => setComment(e.target.value)}/>
        </div>
    <br/>
    </div>
    
                    <Button variant='primary' onClick={()=>{
                        navigate('/dashboard')
                        }}>Go Back to Dashboard</Button>
                        &nbsp;
                    {
                        data.status==="Open"?<Button variant='warning' onClick={()=>{nextStage()}}>In-Progress</Button>
                        :data.status==="In-Progress"?<Button variant='success' onClick={()=>{nextStage()}}>Close</Button>:<></>
                    }
    </div>
    </>:<></>
}
</div>
  </>
}

export default Issues