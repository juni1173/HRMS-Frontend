import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Spinner } from 'reactstrap'
import MeetingList from './Components/MeetingList'
import apiHelper from '../Helpers/ApiHelper'
const index = () => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  // const accessToken = "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6Ijg0ZmIxODRmLTg4Y2QtNGZiYi04OWE5LWFjM2FlZTFlZWQ2MiJ9.eyJ2ZXIiOjksImF1aWQiOiI3MjA1ODg1NmJmODIxMWYwZjU0MGQ1NzI2YzJjYWFiOCIsImNvZGUiOiJBRG40TER1emxWcHVtdlg2eWVDUzkyWEVBUlE2X2N0OHciLCJpc3MiOiJ6bTpjaWQ6d1hDR0xDNk9RVnlGbjB3d2o2NHpxQSIsImdubyI6MCwidHlwZSI6MCwidGlkIjoyLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJNeURpUjQ4clNveXpKdDdwckFnOWRBIiwibmJmIjoxNzE0MzgyMzI0LCJleHAiOjE3MTQzODU5MjQsImlhdCI6MTcxNDM4MjMyNCwiYWlkIjoib2dOOExLUnBTWU9yNm5QaDBHTnRrZyJ9.miDDdJO-5NOqGNu9M88VYpN_MUSEGdzlgRIZH12Evu5H3dgpY7R7354jbr37HFsEQa_-dsdKTWgZfZc8cMI7_w"
  const getToken = async () => {
    setLoading(true)
      await Api.get(`/organizations/update/existing/tokens/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const data = result.data
                setAccessToken(data.access_token) 
            } else {
              setAccessToken('') 
                // Api.Toast('error', result.message)
            }
        } else (
        Api.Toast('error', 'Server not responding!')   
        )
    }) 
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }
  useEffect(async () => {
      getToken()
}, [])
  return (
    <Fragment>
      {!loading ? (
        <>
        {accessToken !== '' ? (
          <>
            <Row>
              <Col md='12'>
                {/* <Card>
                  <CardBody> */}
                  
                  {/* </CardBody>
                </Card> */}
              </Col>
            </Row>
            </>
        ) : (
          <Row>
              <Col md='12'>
                <Card>
                  <CardBody>
                      <h3>Zoom connection error!</h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        )}
        <MeetingList accessToken={accessToken} />
        </>
        
      ) : <div className='text-center'><Spinner/></div>}
        
    </Fragment>
  )
}

export default index