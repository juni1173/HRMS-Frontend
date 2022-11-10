// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// **  Components
import SetupForm from './setupForm'


const SetupFormWizard = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
            <h1>Organization Setup Form</h1>  
            <SetupForm />
        </Col>
      </Row>
    </Fragment>
  )
}
export default SetupFormWizard
