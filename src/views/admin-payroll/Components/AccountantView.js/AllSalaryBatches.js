import React, { Fragment, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'
import apiHelper from '../../../Helpers/ApiHelper'
import { Spinner, Card, CardBody, Badge, Button } from 'reactstrap'
import { ArrowRight } from 'react-feather'
import Tabs from './Tabs'

const SalaryBatches = () => {
  const Api = apiHelper()
  // const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [showAccountantView, setshowAccountantView] = useState(false)
  const [batchData, setBatchData] = useState(null)

  const getData = async () => {
    
    setLoading(true)
    try {
      const response = await Api.get(`/payroll/list/batches/salary/`)
      if (response.status === 200) {
        setData(response.data)
        setLoading(false)
      } else {
        Api.Toast('error', response.message)
        setLoading(false)
      }
    } catch (error) {
      Api.Toast('error', 'Server not responding')
    } finally {
      setLoading(false)
    }
  }

  // const handleProceed = (item) => {
  //   // Navigate to the HrProcess component and pass data
  //   history.push({
  //     pathname: '/accountant/payroll',
  //     state: { batchData: item }
  //   })
  // }
  const handleProceed = (item) => {
    // Set the state to show the HrProcess component and pass data
    setBatchData(item)
    setshowAccountantView(true)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Fragment>
      {!showAccountantView ? <>
      {!loading ? (
        <>
        {data.length > 0 ? <>
          {data.map((item, key) => (
            <div className='row' key={key}>
              <div className='col-lg-12'>
                <Card>
                  <CardBody>
                    <div className='row'>
                      <div className='col-lg-2'>
                        <p>
                          Salary Batch No.{' '}
                          <Badge color='light-success'>{item.batch_no}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-3'>
                        <p>
                          Payroll.{' '}
                          <Badge color='light-success'>{item.payroll_batch_title}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Date{' '}
                          <Badge color='light-success'>{item.start_date}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Status{' '}
                          <Badge color='light-success'>{item.batch_status}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-3'>
                        <Button
                          className='btn btn-success'
                          onClick={() => handleProceed(item)}
                        >
                          Proceed <ArrowRight />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          ))}
          </> : <div className='text-center'>No data found!</div> }
        </>
      ) : (
        <div className='text-center'>
          <Spinner type='grow' color='primary' />
        </div>
      )} </> : <Tabs batchData={batchData}/> }
    </Fragment>
  )
}

export default SalaryBatches
