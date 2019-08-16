import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
var request = require('axios');
import StudyInfo from './StudyInfo';
import DeleteButton from './DeleteButton';
import ModifyPatient from './ModifyPatient';
import appconfig from '../appconfig'

class StudyOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, study: null};
  }
  componentDidMount () {
    request(appconfig.ESPRESSOAPI_URL + '/api/studies/' + this.props.patientStudyId, {headers: {'Authorization': "bearer " + this.props.token}})
    .then((result) => {
      this.setState(() => ({ loading: false, study: result.data.study }))
    })
    .catch((err) => {
      this.setState(() => ({ loading: false, study: null}))
    });
  }
  render() {
    if(!this.state.loading)
    {
      if (this.state.study) {
        return (
          <div>
            <h2>Current Study</h2>
            <StudyInfo {...this.state.study} />
            <h3>Delete</h3>
            <DeleteButton patientStudyId={this.state.study.patientStudyId} />
            <h3>Modify</h3>
            <ModifyPatient {...this.state.study}/>
          </div>
        )
      } else {
        return <div>Unable to find Study</div>
      }
    } else {
      return <div>loading</div>
    }
  }
}

StudyOperations.propTypes = {
  token: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
  return {
    study: state.study,
    token: state.auth.token
  }
}

StudyOperations = connect(mapStateToProps)(StudyOperations)

export default StudyOperations;
