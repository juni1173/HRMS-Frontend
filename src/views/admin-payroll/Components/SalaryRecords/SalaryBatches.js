import React, { Fragment, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'
import apiHelper from '../../../Helpers/ApiHelper'
import { Spinner, Card, CardBody, Badge, Button } from 'reactstrap'
import { ArrowRight, Eye } from 'react-feather'
import Record from './Record'

const RecordBatches = () => {
  const Api = apiHelper()
  // const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [showRecords, setShowRecords] = useState(false)
  const [batchData, setBatchData] = useState(null)

  const getData = async () => {
    
    setLoading(true)
    try {
      const response = await Api.get(`/payroll/salary/record/batches/`)
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
  //     pathname: '/payroll/salary/record',
  //     state: { batchData: item }
  //   })
  // }
  const handleProceed = (item) => {
    // Set the state to show the HrProcess component and pass data
    setBatchData(item)
    setShowRecords(true)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Fragment>
      {!showRecords ? <> 
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
                          View Details <Eye />
                        </Button>
                      </div>
                      <div className='col-md-2'>
                        <p>
                          Total{' '}
                          <Badge color='light-warning'>{item.batch_total}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Salaries{' '}
                          <Badge color='light-warning'>{item.salary_amount}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Add/Ons{' '}
                          <Badge color='light-warning'>{item.addons_amount}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Deductions{' '}
                          <Badge color='light-warning'>{item.deduction_amount}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          ESS{' '}
                          <Badge color='light-warning'>{item.customised_amount}</Badge>
                        </p>
                      </div>
                      <div className='col-lg-2'>
                        <p>
                          Tax{' '}
                          <Badge color='light-warning'>{item.tax_amount}</Badge>
                        </p>
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
      )} </> : <Record batchData={batchData}/> }
    </Fragment>
  )
}

export default RecordBatches
