import { Fragment, useState, useEffect, useContext, useRef } from 'react'

// import {writeFile, utils} from 'xlsx'
// ** Reactstrap Imports
import {
    Row, Col, Card, CardBody, Spinner
  } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import AttendancePieChartComponent from './Components/AttendancePieChartComponent'
// import EmployeeBarChart from '../EmployeeReport/EmployeeBarChart'
// import EmployeeDataTable from '../EmployeeReport/EmployeeDataTable'

// ** Custom Hooks
// import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles


const index = () => {
    const { colors } = useContext(ThemeColors),
    tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    warningLightColor = '#FDAC34',
    successColorShade = '#315180'
  const Api = apiHelper()
  const isMounted = useRef(true)
  const [countData, setCountData] = useState({
    Headcount: 0,
    Presents: 0,
    PresentsData: [],
    WFH: 0,
    WFHData: [],
    Leaves: 0,
    LeavesData: []
})
    const [loading, setLoading] = useState(false)
    
    // const [highestTotalEmployeeCount, sethighestTotalEmployeeCount] = useState(0)
    
  // ** Context, Hooks & Vars
//   const { colors } = useContext(ThemeColors),
//     { skin } = useSkin(),
//     labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
//     successColorShade = '#28dac6',
//     gridLineColor = 'rgba(200, 200, 200, 0.2)'

    const calculateCount = (arr) => {
        // settableData(arr.flatMap(item => item.employees_data))
        if (isMounted.current) setLoading(true)
        const totalLeaves = Object.values(arr.leave_data).length > 0 ? Object.values(arr.leave_data).length : 0
        let totalPresents = 0
        let totalWFH = 0 
        
        if (Object.values(arr.attendance_data).length > 0) {
              
             totalPresents = arr.attendance_data.filter(i => i.attendance_status === 'P').length
             totalWFH = arr.attendance_data.filter(i => i.attendance_status === 'WFH').length
        }
        if (isMounted.current) setCountData(prev => ({
          ...prev,
          Headcount: arr.employee_count,
          Presents: totalPresents,
          PresentsData: arr.attendance_data.filter(i => i.attendance_status === 'P'),
          WFH: totalWFH,
          WFHData: arr.attendance_data.filter(i => i.attendance_status === 'WFH'),
          Leaves: totalLeaves,
          LeavesData: arr.attendance_data.filter(i => i.attendance_status === 'L')
        }))
        setTimeout(() => {
          setLoading(false)
        }, 500)
    }
    
    const getData = async () => {
        await Api.jsonPost(`/today/attendance/leave/data/`, {}).then(result => {
              
            if (result) {
              if (isMounted.current) setLoading(true)
                if (result.status === 200) {
                    const resultData = result.data
                    // setData(prev => ({
                    //     ...prev,
                    //     attendance_data: resultData.attendance_data,
                    //     leave_data: resultData.leave_data
                    // }))
                    calculateCount(resultData)
                } else {
                    // Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
                return () => {
                  isMounted.current = false
                }
            } else (
            Api.Toast('error', 'Server not responding!')   
            )
        })  
       
      }
     
      useEffect(() => {
        getData()
        return () => {
          isMounted.current = false
        }
        }, [])
  
  return (
    <Fragment>   
    <Card className='mb-1 pb-0'>
      <CardBody className='p-0'>
      {!loading ? (
                <Row className=''>
      
                <Col md="12">
                  
                    <AttendancePieChartComponent 
                    countData={countData}
                    tooltipShadow={tooltipShadow}
                    successColorShade={successColorShade}
                    warningLightColor={warningLightColor}
                    danger={colors.danger.main}/>
                      
                </Col>
            </Row>
        ) : <div className="text-center"><Spinner /></div>}
      </CardBody>
        
    </Card>
      
    </Fragment>
  )
}

export default index