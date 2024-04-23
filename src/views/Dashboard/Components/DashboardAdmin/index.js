// ** Reactstrap Imports
import { Fragment } from 'react'
import { Row, Col, Card, CardBody, CardText } from 'reactstrap'
// import welcomeImage from '@src/assets/images/illustration/dashboard_image.svg'
import welcomeImage from '@src/assets/images/illustration/email.svg'
// ** Images
import UpcomingInterview from './UpcomingInterview'
import UpcomingLeaves from './UpcomingLeaves'
import MedicalApprovals from './MedicalApprovals'
const index = () => {
    
  return (
    <Fragment>
        <Row>
            <Col md="8">
                <Card className='card-congratulations-medal card-congratulations' style={{height:'250px'}}>
                <CardBody>
                    <h5 className='text-white'>Welcome to HRMS!</h5>
                    <CardText className='font-small-3'>Your Record & information at one centralised and secure place,<br></br> Want to Edit your Information?</CardText>
                    <img className='congratulation-medal' src={welcomeImage} alt='Pic' width={200}/>
                </CardBody>
                </Card>
                <Row>
                <Col md='6'>
                        <UpcomingLeaves/>
                    </Col>
                    <Col md='6'>
                        <MedicalApprovals/>
                    </Col>
                </Row>
            </Col>
            <Col md='4'>
                <UpcomingInterview />
            </Col>
            
        </Row>
    </Fragment>
  )
}

export default index
