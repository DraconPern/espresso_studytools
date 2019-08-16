import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
var request = require('axios');
import appconfig from '../appconfig'

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.state = {deleted: false, deleting: false};
  }

  handleClick() {
    this.setState(() => ({ deleting: true }));
    request.delete(appconfig.ESPRESSOAPI_URL + '/api/studies/' + this.props.patientStudyId, {headers: {'Authorization': "bearer " + this.props.token}})
    .then((result) => {
      this.setState(() => ({ deleted: true, deleting: false }))
    })
    .catch((err) => {
      this.setState(() => ({ deleted: false, deleting: false }))
    });
  }

  render() {
    if(this.state.deleting)
    {
      return <div>Deleting</div>
    } else {
      if (this.state.deleted) {
        return <div>Deleted Study</div>
      } else {
        return (
          <div>
            <button onClick={this.handleClick}>Delete Study</button>
          </div>
        )
      }
    }
  }
}

DeleteButton.propTypes = {
  token: PropTypes.string.isRequired,
  patientStudyId: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

DeleteButton = connect(mapStateToProps)(DeleteButton)

export default DeleteButton;
