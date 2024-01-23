import {Fragment} from 'react'
import { Row, Col, Badge } from 'reactstrap'
import ReasonsTable from './Approvals/ReasonsTable'
const CertificateDetails = ({ data }) => {
  return (
    <Fragment>
        <Row>
            <Col md={12}>
                <h2>{data.employee_name ? data.employee_name : 'No Name found'}</h2>
            </Col>
            <Col md={12}>
                <p>{data.position_title ? data.position_title : 'No Position found'}</p>
            </Col>
            <hr></hr>
            <Col md={4} className='my-2'>
                <b>Duration</b>: <Badge>{data.duration ? data.duration : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Training Mode</b>: <Badge>{data.mode_of_course_title ? data.mode_of_course_title : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Relevance</b>: <Badge>{data.relevance_title ? data.relevance_title : 'N/A'}</Badge> 
            </Col>
            <Col md={6} className='my-2'>
                <b>Status</b>: <Badge>{data.certification_status_title ? data.certification_status_title : 'N/A'}</Badge> 
            </Col>
            <Col md={6} className='my-2'>
                <b>Cost</b>: <Badge>{data.cost ? data.cost : 'N/A'}</Badge>
            </Col>
            <Col md={6} className='my-2'>
                <b>Team Lead</b>: <Badge>{data.team_lead_name ? data.team_lead_name : 'No Lead'}</Badge>
            </Col>
            <Col md={12} className='my-2'>
                <b>Reimbursement</b>: <Badge>{data.reimbursement_status ? data.reimbursement_status_title : 'Not Applied'}</Badge>
            </Col>
            <Col md={12} className='my-2'>
                <b>Course Reason</b>: <Badge>{data.course_reason ? data.course_reason : 'N/A'}</Badge>
            </Col>
            <Col md={12} className='my-2'>
                <b>Decisions</b> :<br></br>
                <ReasonsTable reasonsData={(data.decision && (data.decision).length > 0) ? data.decision : []}/>
            </Col>

        </Row>
    </Fragment>
  )
}

export default CertificateDetails