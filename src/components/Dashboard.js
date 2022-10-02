import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import { BaseContext } from '../App';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{tableCellClasses}from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    let context = useContext(BaseContext)
    let [data, setData] = useState([])
    let [stage, setStage] = useState("")
    let navigate = useNavigate()
    let [count, setCount] = useState({
        "open":0,
        "inProgress":0,
        "closed":0
    })

    let loadCount = async() =>{
        let res = await axios.get(`${context.apiurl}/issues-counts`)
        if(res.data.statusCode === 200){
            setCount(res.data)
        }
    }

    let loadStage = async(stage) => {
        let res = await axios.get(`${context.apiurl}/issues-by-status/${stage}`)
        if(res.data.statusCode===200){
            setStage(stage)
            console.log("Dashboard ",res.data.issues)
            setData(res.data.issues)
        }
    }
    useEffect(() => {
        loadCount()
    },[])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
 return<>
 <div className='dashboard-wrapper'>
    <div className='head-wrapper'>
    <Card  className='cards'>
        <Card.Body onClick={()=>loadStage("Open")}>
            <Card.Title>Open Issues {count.open}</Card.Title>
        </Card.Body>
    </Card>

    <Card  className='cards'>
        <Card.Body onClick={()=>loadStage("In-Progress")}>
            <Card.Title>In-Progress Issues {count.inProgress}</Card.Title>
        </Card.Body>
    </Card>

    <Card className='cards'>
        <Card.Body onClick={()=>loadStage("Closed")}>
            <Card.Title>Closed Issues {count.closed}</Card.Title>
        </Card.Body>
    </Card>
    </div>
    <div className='main-wrapper'>
        {
            stage !==""? <h1>List of {stage} issues :</h1> : <></>
        }
        {
            data.length ?
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">#</TableCell>
            <TableCell align="right">Issue Title</TableCell>
            <TableCell align="right">Issue Type</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Mobile</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((e, i) => (
            <StyledTableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              style={{"cursor":"pointer"}}
              onClick = {() => {
                navigate(`/issue/${e._id}`)} }
            >
              <StyledTableCell align="right">{i+1}</StyledTableCell>
              <StyledTableCell align="right">{e.issueTitle}</StyledTableCell>
              <StyledTableCell align="right">{e.issueType}</StyledTableCell>
              <StyledTableCell align="right">{new Date(e.createdAt).toLocaleString()}</StyledTableCell>
              <StyledTableCell align="right">{e.name}</StyledTableCell>
              <StyledTableCell align="right">{e.mobile}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    : <><h5 style={{"textAlign":"center"}}>No {stage} tickets</h5></>
        }
    </div>
 </div>
 </>
}

export default Dashboard