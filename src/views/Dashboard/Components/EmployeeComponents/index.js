// ** Reactstrap Imports
import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardText } from 'reactstrap'
// import welcomeImage from '@src/assets/images/illustration/dashboard_image.svg'
// import welcomeImage from '@src/assets/images/illustration/email.svg'
// ** Images
import UpcomingHolidays from './UpcomingHolidays'
import UpcomingLeaves from './UpcomingLeaves'
import MedicalApprovals from './MedicalApprovals'
import apiHelper from '../../../Helpers/ApiHelper'
import GymApprovals from './GymApprovals'
import AttendanceCard from './AttendanceCalendar'
import TasksModule from '../../../TasksModule/index'
const EmployeeDash = () => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const preDataApi = async () => {
      setLoading(true)
      const response = await Api.get('/employees-self-service/homepage/')
      if (response.status === 200) {
          setData(response.data)
      } else {
          return Api.Toast('error', 'Server not found')
      }
      // let date = new Date()
      // date = Api.formatDate(date)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
  }
    useEffect(() => {
      preDataApi()
      }, [])
  return (
    <Fragment>
        {(!loading) && (
        <Row>
            <Col md='4'>
                <AttendanceCard data={data.upcoming_holiday ? data.upcoming_holiday : []}/>
                <UpcomingHolidays data={data.upcoming_holiday ? data.upcoming_holiday : []}/>
                <UpcomingLeaves data={data.Leaves_count ? data.Leaves_count : []}/>
                <MedicalApprovals data={data.medical ? data.medical : []} medical_count={data.medical_count ? data.medical_count : {}}/>
                <GymApprovals data={data.gym ? data.gym : []}/>
            </Col>
            <Col md='8'>
                <TasksModule />
            </Col>
            
        </Row>
        )}
        {/* <Row>
            <Col md="8">
                <Card className='card-congratulations-medal card-congratulations' style={{height:'250px'}}>
                <CardBody>
                    <h5 className='text-white'>Welcome to HRMS!</h5>
                    <CardText className='font-small-3'>Your Record & information at one centralised and secure place,<br></br> With our HRMS dashboard, you'll have access to a comprehensive<br></br> suite of tools and features to simplify your daily HR tasks,<br></br> empower your decision-making, and foster a more connected<br></br> workplace environment.</CardText>
                    <img className='congratulation-medal' src={welcomeImage} alt='Pic'/>
                </CardBody>
                </Card>
            </Col>
            
            {(!loading) && (
                        <>
                        <Col md='4'>
                            <AttendanceCard data={data.upcoming_holiday ? data.upcoming_holiday : []}/>
                        </Col>
                        <Col md='3'>
                            <UpcomingHolidays data={data.upcoming_holiday ? data.upcoming_holiday : []}/>
                        </Col>
                        
                            <Col md='3'>
                                <UpcomingLeaves data={data.Leaves_count ? data.Leaves_count : []}/>
                            </Col>
                            <Col md='3'>
                                <MedicalApprovals data={data.medical ? data.medical : []} medical_count={data.medical_count ? data.medical_count : {}}/>
                            </Col>
                            <Col md='3'>
                                <GymApprovals data={data.gym ? data.gym : []}/>
                            </Col>
                        </>
                    )}
        </Row> */}
    </Fragment>
  )
}

export default EmployeeDash
