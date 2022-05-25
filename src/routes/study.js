import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import manageResponse from '../manageResponse';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import AutoAlert from '../parts/AutoAlert';

function DeleteStudy({patientStudyId}) {
  const token = useSelector((state) => state.auth.token);
  const [errormessage, seterrormessage] = useState("");
  const [successmessage, setsuccessmessage] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = (reallydelete) => {setShow(false); if(reallydelete) deleteStudy(patientStudyId); }
  const handleShow = () => setShow(true);

  const deleteStudy = useCallback((patientStudyId) => {
    fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/studies/' + patientStudyId, { headers: { Authorization: "Bearer " + token }, method: 'DELETE'})
    .then((res1) => manageResponse(res1))
    .then((response) => {
      setsuccessmessage('study removed');
      seterrormessage("");
    })
    .catch(function(err) {
      setsuccessmessage("");
      seterrormessage(err);
    })
  }, [token]);

  return (
    <React.Fragment>
    <h3>Delete Study</h3>
    <AutoAlert variant="danger">{errormessage}</AutoAlert>
    <AutoAlert variant="success">{successmessage}</AutoAlert>
    <Form>
      <Form.Group className="mb-3">
        <Button variant="danger" onClick={handleShow}>Delete Study</Button>
      </Form.Group>
    </Form>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Really delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Really delete study?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(true)}>Yes</Button>
          <Button variant="primary" onClick={() => handleClose(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

function ModifyStudy({patientStudyId, original_patientname, original_patientid, }) {
  const token = useSelector((state) => state.auth.token);
  const [errormessage, seterrormessage] = useState("");
  const [successmessage, setsuccessmessage] = useState("");
  const [patientname, setpatientname] = useState(original_patientname);
  const [patientid, setpatientid] = useState(original_patientid);

  const [totalcount, settotalcount] = useState(0);
  const [modifyStudyQueueId, setmodifyStudyQueueId] = useState(null);
  const [modifytick, setmodifytick] = useState(0);

  const modifystudy = useCallback((patientStudyId, patientname, patientid) => {
    fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/studies/' + patientStudyId + '/getStudyInstanceCount', {headers: {'Authorization': "bearer " + token}})
    .then((res1) => manageResponse(res1))
    .then((response) => {
      settotalcount(response.count);
      console.log(patientid);
      return fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/studies/' + patientStudyId + '/modify', { body: JSON.stringify({PatientName: patientname, PatientID: patientid}), headers: { Authorization: "Bearer " + token, 'Content-Type': 'application/json'}, method: 'POST'})
    })
    .then((res1) => manageResponse(res1))
    .then((response) => {
      //
      setmodifyStudyQueueId(response.modifyStudyQueueId);
      setmodifytick(0);
      seterrormessage("");
    })
    .catch(function(err) {
      setsuccessmessage("");
      seterrormessage(err);
    })
  }, [token]);

  useEffect(() => {
    // do nothing if there's no modifyStudyQueueId
    if(!modifyStudyQueueId)
      return;

    setTimeout(() => {
      fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/studies/' + patientStudyId + '/modify/' + modifyStudyQueueId, { headers: {'Authorization': "Bearer " + token}})
      .then((res1) => manageResponse(res1))
      .then((response) => {
        var ratio = response.count + '/' + totalcount;

        var tick;
        switch(modifytick % 4) {
          case 0:
            tick = '| ';
            break;
          case 1:
            tick = '/ ';
            break;
          case 2:
            tick = '- ';
            break;
          case 3:
            tick = '\\ ';
            break;
          default:
            break;
        }
        setmodifytick(modifytick + 1);
        setsuccessmessage(ratio + ' ' + tick);

        if(response.count === totalcount) {
          setsuccessmessage(ratio + " Done!");
          setmodifyStudyQueueId(null);
        }
      })
    }, 200);
  }, [token, patientStudyId, modifyStudyQueueId, totalcount, modifytick]);

  return (
    <React.Fragment>
    <h3>Modify Study</h3>
    <AutoAlert variant="danger">{errormessage}</AutoAlert>
    <AutoAlert variant="success">{successmessage}</AutoAlert>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Patient Name</Form.Label>
        <Form.Control type="text" name="patientname" value={patientname} onChange={(event) => {setpatientname(event.target.value)}} />
      <Form.Group className="mb-3">
      </Form.Group>
        <Form.Label>Patient ID</Form.Label>
        <Form.Control type="text" name="patientid" value={patientid} onChange={(event) => {setpatientid(event.target.value)}} />
      </Form.Group>
      <Button variant="primary" onClick={() => modifystudy(patientStudyId, patientname, patientid)}>Modify Study</Button>
    </Form>
    </React.Fragment>
  )
}

export default function Study({patientStudyId}) {
  const token = useSelector((state) => state.auth.token);
  const [study, setstudy] = useState(null);
  const [errormessage, seterrormessage] = useState("");
  const [successmessage, setsuccessmessage] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/studies/' + patientStudyId, {headers: {'Authorization': "bearer " + token}})
    .then((res1) => manageResponse(res1))
    .then((response) => {
      var result = response.study;

      setstudy(result);
      setsuccessmessage("");
      seterrormessage("");
    })
    .catch(function(err) {
      seterrormessage(err);
    })

  }, [patientStudyId, token]);

  return (
    <React.Fragment>
      <h3>Current Study</h3>
      <AutoAlert variant="danger">{errormessage}</AutoAlert>
      <AutoAlert variant="success">{successmessage}</AutoAlert>
      { study ? <div>
            <div>PatientName: {study.PatientName}</div>
            <div>Patient ID: {study.PatientID}</div>
            <div>Study Date: {new Date(study.StudyDate).toLocaleDateString()}</div>
            <Button href={process.env.REACT_APP_ESPRESSOWEB_URL + "/studies/" + study.patientStudyId}>View study in Espresso Medical</Button>
            <ModifyStudy patientStudyId={study.patientStudyId} original_patientname={study.PatientName} original_patientid={study.PatientID} />
            <DeleteStudy patientStudyId={study.patientStudyId} />
          </div>
        : <div>Please search for a study at <a href={process.env.REACT_APP_ESPRESSOWEB_URL}>Espresso Medical</a></div>
      }
    </React.Fragment>
  );
}
