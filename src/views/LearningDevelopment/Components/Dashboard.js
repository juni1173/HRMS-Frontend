import { useState, Fragment, useEffect } from 'react'
// import CalenderComponent from './Calender'
import SessionCalendar from './SessionCalendar'
import { Card, CardBody, Row, Col } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import ApplicantsChart from './DashboardComponents/ApplicantsChart'
import SessionChart from './DashboardComponents/SessionChart'
const Dashboard = () => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [applicantChart] = useState([])
  const [sessionChart] = useState([])
  const getDashboardData = async () => {
    setLoading(true)
    await Api.get(`/learning-and-development/dashboards/`).then(result => {
      if (result) {
        if (result.status === 200) {
          console.warn(result.data)
          setData(result.data)
          applicantChart.splice(0, applicantChart.length)
          sessionChart.splice(0, sessionChart.length)
          applicantChart.push({Unprocessed: result.data.unprocessed_applicants, Inprocess: result.data.inprocess_applicants, Approved: result.data.approved_applicants, Rejected: result.data.rejected_applicants, Waitlisted: result.data.waitlisted_applicants})
          sessionChart.push({Completed: result.data.completed_sessions, Ongoing: result.data.ongoing_sessions, Notinitiated: result.data.not_initiated_sessions})
        } else {
          Api.Toast('error', result.message)
        }
      }
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    getDashboardData()
  }, [setData])
  return (
    <Fragment>
      <Row>
        <Col md='3'>
        <Card className='mb-2'>
          {!loading && (
             <CardBody className='pb-0'>
              <p>Total Courses</p>
              <h3>{data.total_courses}</h3>
            </CardBody>
          )}
        </Card>
        <Card className='mb-2'>
          {!loading && (
             <CardBody className='pb-0'>
              <p>Total Applicants</p>
              <h3>{data.total_applicants}</h3>
            </CardBody>
          )}
        </Card>
        {!loading && (
          <Card>
          <CardBody>
            {applicantChart.length > 0 && (
              <ApplicantsChart data={applicantChart} applicants={data.total_applicants}/>
            )}
          </CardBody>
        </Card>
        )}
        </Col>
        <Col md='6'>
        <Card className='shadow-none border-0 mb-0 rounded-0'>
            <CardBody className='pt-0'>
                <SessionCalendar/>
            </CardBody>
        </Card>
        </Col>
        <Col md='3'>
        <Card className='mb-2'>
          {!loading && (
             <CardBody className='pb-0'>
              <p>Total Sessions</p>
              <h3>{data.total_sessions}</h3>
            </CardBody>
          )}
           
        </Card>
        <Card className='mb-2'>
          {!loading && (
             <CardBody className='pb-0'>
              <p>Total Trainees</p>
              <h3>{data.total_trainees}</h3>
            </CardBody>
          )}
        </Card>
        {!loading && (
         <Card>
         <CardBody>
            {sessionChart.length > 0 && (
              <SessionChart data={sessionChart} Sessions={data.total_sessions}/>
            )}
         </CardBody>
         </Card>
        )}
        
        </Col>
      </Row>
      
        {/* <Card className='shadow-none border-0 mb-0 rounded-0'>
            <CardBody className='pb-0'>
                <CalenderComponent/>
            </CardBody>
        </Card> */}
        
    </Fragment>
  )
}

export default Dashboard