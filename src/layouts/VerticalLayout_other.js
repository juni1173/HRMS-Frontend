// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import { useState, useEffect } from 'react'
import { Spinner } from 'reactstrap'
// ** Menu Items Array
// import navigation from '@src/navigation/vertical'
import No_Org_Nav from '../navigation/vertical/NavComp/No_Org_Nav'
import apiHelper from '../views/Helpers/ApiHelper'
// import Exist_Org_Nav from '../navigation/vertical/NavComp/Exist_Org_Nav'
const VerticalLayout = props => {
  const Api = apiHelper()
  const [menuData, setMenuData] = useState([])

  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(false)
  // ** For ServerSide navigation
  // useEffect(() => {
  //   Api.get(`/navigations/`).then(response => setMenuData(response.data))  
  // }, [])
  const getNav =  () => {
    setLoading(true)
      Api.get(`/navigations/role/based/on/login/user/`).then(response => {
        setMenuData(response.data)
        localStorage.setItem('nav', JSON.stringify(response.data))
      })  
     setOrg(JSON.parse(localStorage.getItem('organization')) || null)   
     setTimeout(() => {
      setLoading(false)
     }, 1000)
  }
  useEffect(() => {
      getNav()
  }, [])

  return (
    !loading ? (
      org ? (
        <Layout menuData={menuData} {...props}>
          {props.children}
        </Layout>
      ) : (
        <Layout menuData={menuData} {...props}>
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
}

export default VerticalLayout
