import React, { Fragment, useState, useEffect, useCallback } from 'react'
import apiHelper from '../Helpers/ApiHelper'
import SessionsList from './Components/sessionsList'
const index = () => {
  const Api = apiHelper()
    const [data, setData] = useState([])
    const preDataApi = async () => {
      const response = await Api.get('/applicants/register/course_session/')
      if (response.status === 200) {
        setData(response.data.course_session)
         
      } else {
          return Api.Toast('error', 'Sessions data not found')
      }
  }
  useEffect(() => {
      preDataApi()
      }, [])
      const handleDataProcessing = useCallback(() => {
        preDataApi()
      }, [data])
  return (
    <Fragment>
       <SessionsList data={data} CallBack={handleDataProcessing}/>
    </Fragment>
  )
}

export default index