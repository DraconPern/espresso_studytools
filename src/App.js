import './App.css';

import Layout from "./layout";
import { HashRouter, Routes, Route, useParams } from "react-router-dom";
import Study from './routes/study'

function StudyParams() {
  let params = useParams();
  return <Study patientStudyId={params.patientStudyId} />
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout content=<div>Please select a study first</div> />}/>
        <Route path="/study/:patientStudyId" element={<Layout content=<StudyParams /> />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
