import React, { useEffect, useState, Fragment } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import { Row, Col, Spinner } from 'reactstrap'
import KpiChartByBatch from './KpiChartByBatch'
const BatchBasedKpiData = ({ id }) => {
    const [loading, setLoading] = useState(false)
    const Api = apiHelper()
const [data, setData] = useState([])
const getData = async () => {
    setLoading(true)
    if (id) {
        const formData = new FormData()
        formData['employee'] = id
        await Api.jsonPost(`/kpis/segmenetation/based/result/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resultData = result.data
                    // console.warn(resultData)
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
            {!loading ? (
            (data && data.length > 0) ? (
                <KpiChartByBatch data={data[0].batches_data} success='#28dac6'/>
            ) : <div>No data found!</div>
            ) : <div className='text-center'><Spinner /> Loading Performance Data</div>
            }
    </Fragment>
  )
}

export default BatchBasedKpiData