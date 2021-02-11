import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
var request = require('axios');
import appconfig from '../appconfig'

class ModifyPatient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PatientName: props.PatientName,
      PatientID: props.PatientID,
      modified: false,
      modifying: false,
      progress: '',
      progress_graphics: 0,
    }

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  checkStatus(modifyStudyQueueId) {
    request(appconfig.ESPRESSOAPI_URL + '/api/studies/' + this.props.patientStudyId + '/modify/' + modifyStudyQueueId, {headers: {'Authorization': "bearer " + this.props.token}})
    .then((result) => {
      var display_string = result.data.count + '/' + this.props.totalcount;
      if(this.state.progress_graphics % 4 == 0)
        display_string = '| ' + display_string;
      else if(this.state.progress_graphics % 4 == 1)
        display_string = '/ ' + display_string;
      else if(this.state.progress_graphics % 4 == 2)
        display_string = '- ' + display_string;
      else if(this.state.progress_graphics % 4 == 3)
        display_string = '\\ ' + display_string;

      this.setState(() => ({progress: display_string}));

      if(result.data.count == this.props.totalcount) {
        this.setState(() => ({ modified: true, modifying: false }));
        clearInterval(this.interval);
      }

      this.setState(() => ({ progress_graphics: this.state.progress_graphics + 1 }));
    })
  }
  handleClick() {
    this.setState(() => ({ modifying: true }))
    request.post(appconfig.ESPRESSOAPI_URL + '/api/studies/' + this.props.patientStudyId + '/modify', {PatientName: this.state.PatientName, PatientID: this.state.PatientID}, {headers: {'Authorization': "bearer " + this.props.token}})
    .then((result) => {
      this.interval = setInterval(() => this.checkStatus(result.data.modifyStudyQueueId) , 200);
    })
    .catch((err) => {
      this.setState(() => ({ modifying: false }))
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    if(this.state.modifying)
    {
      return <div>Modifying: {this.state.progress}</div>
    } else {
      if (this.state.modified) {
        return <div>Modified Study</div>
      } else {
        return (
          <div>
          <div>Patient Name: <input type="text" name="PatientName" value={this.state.PatientName} onChange={this.handleInputChange}/></div>
          <div>PatientID: <input type="text" name="PatientID" value={this.state.PatientID} onChange={this.handleInputChange}/></div>
          <button onClick={this.handleClick}>Modify Study</button>
          </div>
        )
      }
    }
  }
}

ModifyPatient.propTypes = {
  token: PropTypes.string.isRequired,
  patientStudyId: PropTypes.string.isRequired,
  PatientName: PropTypes.string.isRequired,
  PatientID: PropTypes.string.isRequired,
  totalcount: PropTypes.number.isRequired,
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
  }
}

ModifyPatient = connect(mapStateToProps)(ModifyPatient)

export default ModifyPatient;
