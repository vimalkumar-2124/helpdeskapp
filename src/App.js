import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import HelpDeskForm from './components/HelpDeskForm';
import Success from './components/Success';
import Status from './components/Status';
import React from 'react';

export const BaseContext = React.createContext()
const apiurl = 'http://localhost:8000'
function App() {
  return <>
  <BrowserRouter>
    <BaseContext.Provider value={{apiurl}}>
      <Routes>
        <Route path='/new-issue' element={<HelpDeskForm/>}/>
        <Route path='/success/:id' element={<Success/>}/>
        <Route path='/ticket/:id' element={<Status/>}/>
        <Route path='*' element={<Navigate to='/new-issue'/>}/> 
      </Routes>
    </BaseContext.Provider>
  </BrowserRouter>
  </>
}

export default App;
