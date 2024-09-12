// ** Reactstrap Imports
import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardText, Spinner } from 'reactstrap'
// import welcomeImage from '@src/assets/images/illustration/dashboard_image.svg'
// import welcomeImage from '@src/assets/images/illustration/email.svg'
// ** Images
import UpcomingHolidays from './UpcomingHolidays'
import UpcomingLeaves from './UpcomingLeaves'
import MedicalApprovals from './MedicalApprovals'
import apiHelper from '../../../Helpers/ApiHelper'
import GymApprovals from './GymApprovals'
import AttendanceDashboard from './AttendanceDashboard/index'
import EmployeeDataDashboard from './EmployeeDataDashboard/index'
import AttendanceReport from '../../../Reports/Components/Attendance/index'
import EventsCalender from '../Calender'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const getData = async () => {
        setLoading(true)
        try {
            const result = await Api.get(`/get/pending/allowance/`)
            if (result && result.status === 200) {
                
                const resultData = result.data
                setData(resultData)
            }
        } catch (error) {
            Api.Toast('error', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getData()
    }, []) // Empty dependency array to ensure getData() only runs once on component mount
  return (
    <Fragment>
        <Row>
            {!loading ? (
                <>
                    <Col md="8">
                        <EmployeeDataDashboard type="dashboard"/>
                        {/* <AttendanceReport type="dashboard"/> */}
                    </Col>
                    <Col md='4'>
                        <AttendanceDashboard />
                        <Row>
                        <Col md='12'>
                            <UpcomingHolidays data={data.upcoming_holiday ? data.upcoming_holiday : []}/>
                        </Col>
                        <Col md='12'>
                            <UpcomingLeaves data={data.pending_leaves ? data.pending_leaves : []}/>
                        </Col>
                        <Col md='12'>
                            <MedicalApprovals data={data.pending_medical ? data.pending_medical : []}/>
                        </Col>
                        <Col md='12'>
                            <GymApprovals data={data.pending_gym ? data.pending_gym : []}/>
                        </Col>
                        </Row>
                        
                    </Col>
                    {/* <Row>
                        
                        <Col md='4'>
                            <UpcomingLeaves data={data.pending_leaves ? data.pending_leaves : []}/>
                        </Col>
                        
                        {/* <Col md='4'>
                            <EventsCalender />
                        </Col> 
                    </Row> */}
                    
                </>
            ) : <div className="text-center"><Spinner /> </div>}
            
            {/* <Col md="8">
                <Card className='card-congratulations-medal card-congratulations' style={{height:'250px'}}>
                <CardBody>
                    <h5 className='text-white'>Welcome to HRMS!</h5>
                    <CardText className='font-small-3'>Your Record & information at one centralised and secure place,<br></br> With our HRMS dashboard, you'll have access to a comprehensive<br></br> suite of tools and features to simplify your daily HR tasks,<br></br> empower your decision-making, and foster a more connected<br></br> workplace environment.</CardText>
                    <img className='congratulation-medal' src={welcomeImage} alt='Pic'/>
                </CardBody>
                </Card>
            </Col> */}
        </Row>
    </Fragment>
  )
}

export default index
