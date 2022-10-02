import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import HelpDeskForm from './components/HelpDeskForm';
import Success from './components/Success';
import Status from './components/Status';
import React from 'react';
import Dashboard from './components/Dashboard';
import Issues from './components/Issues';

export const BaseContext = React.createContext()
const apiurl = 'http://localhost:8000'
function App() {
  return <>
  <BrowserRouter>
    <BaseContext.Provider value={{apiurl}}>
      <Routes>
        <Route path='/new-issue' element={<HelpDeskForm/>}/>
        <Route path='/success/:id' element={<Success/>}/>
        <Route path='/track-issue' element={<Status/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/issue/:id' element={<Issues/>}/>
        <Route path='*' element={<Navigate to='/new-issue'/>}/> 
      </Routes>
    </BaseContext.Provider>
  </BrowserRouter>
  </>
}

export default App;
