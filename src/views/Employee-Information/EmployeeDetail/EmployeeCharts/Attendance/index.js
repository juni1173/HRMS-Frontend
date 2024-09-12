import React, { useEffect, useState, Fragment } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import AttendcanceChart from './AttendcanceChart'
import { Row, Col, Spinner } from 'reactstrap'
const index = ({ id }) => {
    const [loading, setLoading] = useState(false)
    const Api = apiHelper()
const [data, setData] = useState([])
const getData = async () => {
    setLoading(true)
    if (id) {
        await Api.jsonPost(`/attendance/count/${id}/`, {}).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resultData = result.data
                    console.warn(resultData)
                    setData(resultData)
                } else {
                    Api.message('error', result.message)
                }
            }
        })
    }
    setTimeout(() => {
        setLoading(false)
    }, 500)
}
 useEffect(() => {
    getData()
 }, [setData])

  return (
    <Fragment>
        <Row>
            <Col md='12'>
            {!loading ? (
            (data && data.length > 0) ? (
            // data.map(item => (
            //     <p key={item.id}>{item.id}</p>
            // ))
            <AttendcanceChart data={data}/>
                ) : <div>No data found!</div>
            ) : <div className='text-center'><Spinner /> Loading Attendance Data</div>
            }
            </Col>
        </Row>
        
    </Fragment>
  )
}

export default index