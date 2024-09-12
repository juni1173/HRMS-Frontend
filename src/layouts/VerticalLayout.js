// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import { useState, useEffect } from 'react'
import { Spinner } from 'reactstrap'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import emp_nav from '@src/navigation/vertical/NavComp/Emp_Nav'
import No_Org_Nav from '../navigation/vertical/NavComp/No_Org_Nav'
import { Redirect } from 'react-router-dom'
// import Exist_Org_Nav from '../navigation/vertical/NavComp/Exist_Org_Nav'
const VerticalLayout = props => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
    // axios.get(URL).then(response => setMenuData(response.data))  
  // }, [])
  const [org, setOrg] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
      setLoading(true)
       setOrg(JSON.parse(localStorage.getItem('organization')) || null)   
        
        JSON.parse(localStorage.getItem('userData')) ? setUserRole(JSON.parse(localStorage.getItem('userData')).user_role) : setUserRole(null)
    
       setTimeout(() => {
        setLoading(false)
       }, 1000)
  }, [localStorage.getItem('organization')])
if (JSON.parse(localStorage.getItem('userData'))) {
  return (
    !loading ? (
      org ? (
          userRole === 'employee' ? (
            <>
            <Layout menuData={emp_nav} {...props}>
            {props.children}
          </Layout>
          </>
          ) : (
            <Layout menuData={navigation} {...props}>
            {props.children}
          </Layout>
          )
      ) : (      
        <Layout menuData={No_Org_Nav} {...props}>
          {props.children}
        </Layout>
      )
    ) : (
      <div className="container h-100 d-flex justify-content-center">
        <div className="jumbotron my-auto">
          <div className="display-3"><Spinner type='grow' color='primary'/></div>
        </div>
    </div>
    )
    
    
  )
} else {
  return <Redirect to='/' />
}
 
}

export default VerticalLayout
