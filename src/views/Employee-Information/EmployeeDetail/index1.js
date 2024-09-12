// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiHelper from '../../Helpers/ApiHelper'

// ** Reactstrap Imports
import { Row, Col, Alert, Spinner } from 'reactstrap'
import PersonalDetail from './PersonalDetail'
import UserTabs from './UserTabs'

// ** User View Components
// import UserTabs from './Tabs'
// import PlanCard from './PlanCard'
// import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'
import '@styles/react/pages/page-profile.scss'
import ProfileHeader from './ProfileHeader'

const UserView = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(true)
    const [url_params] = useState(useParams())
    const [empData, setEmpData] = useState({
        employee: [],
        employee_bank: [],
        employee_companies: [],
        employee_contacts: [],
        employee_dependents: [],
        employee_education: [],
        employee_skills: [],
        employee_project_roles: []
    })

  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
const getEmployeeData = async () => {
    setLoading(true)
    if (!url_params.uuid) {
        return false   
    }
   await Api.get(`/employees/pre/complete/data/${url_params.uuid}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const finalData = result.data
                setEmpData(prevState => ({
                    ...prevState,
                    employee : finalData.employee,
                    employee_companies: finalData.employee_companies ? finalData.employee_companies : [],
                    employee_bank: finalData.employee_bank ? finalData.employee_bank : [],
                    employee_contacts: finalData.employee_contacts ? finalData.employee_contacts : [],
                    employee_dependents: finalData.employee_dependents ? finalData.employee_dependents : [],
                    employee_education: finalData.employee_education ? finalData.employee_education : [],
                    employee_skills: finalData.employee_skills ? finalData.employee_skills : [],
                    employee_project_roles: finalData.employee_project_roles ? finalData.employee_project_roles : []
                    }))
                    setLoading(false)
            } else {
                Api.Toast('error', result.message)
                setLoading(false)
            }
        } else {
            Api.Toast('error', 'Server not responding')
        }
    })
}
useEffect(() => {
getEmployeeData()
}, [])
const CallBack = () => {
    getEmployeeData()
}
  return (
    <div className='app-user-view'>
        {!loading ?  <Row>
          <div id='user-profile'>
            <Col md='12'>
              <ProfileHeader active={active} toggleTab={toggleTab} empData={empData} CallBack={CallBack} url_params={url_params}/>
            </Col>
          </div>
      </Row> : <div  className='text-center'><Spinner type='grow' color='primary'/></div> }
    </div>
  )
}
export default UserView
