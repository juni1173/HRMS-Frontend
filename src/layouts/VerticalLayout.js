// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import { useState, useEffect } from 'react'
import { Spinner } from 'reactstrap'
// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import No_Org_Nav from '../navigation/vertical/NavComp/No_Org_Nav'
// import Exist_Org_Nav from '../navigation/vertical/NavComp/Exist_Org_Nav'
const VerticalLayout = props => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
    // axios.get(URL).then(response => setMenuData(response.data))  
  // }, [])
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
      setLoading(true)
       setOrg(JSON.parse(localStorage.getItem('organization')) || null)   
       setTimeout(() => {
        setLoading(false)
       }, 1000)
  }, [localStorage.getItem('organization')])

  return (
    !loading ? (
      org ? (
        <Layout menuData={navigation} {...props}>
          {props.children}
        </Layout>
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
}

export default VerticalLayout
