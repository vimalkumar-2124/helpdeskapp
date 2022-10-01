import React from 'react'
import { useParams } from 'react-router-dom'

function Success() {
  let params = useParams()
  return<>
  <div>
    Success your ticket number is {params.id}
  </div>
  </>
}

export default Success