import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
var request = require('axios');
import appconfig from '../appconfig'

class StudyInfo extends React.Component {
  render() {
    return (
      <div>
        <div>Patient Name: {this.props.PatientName}</div>
        <div>Patient ID: {this.props.PatientID}</div>
        <div>Study Date: {this.props.StudyDate}</div>
        <div>
          <a href={appconfig.ESPRESSOWEB_URL + "/studies/" + this.props.patientStudyId}>Link to study</a>
        </div>
      </div>
    )
  }
}

export default StudyInfo;
