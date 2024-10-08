import React, { useEffect, useState, Fragment } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import AttendcanceChart from './AttendcanceChart'
import { Row, Col, Spinner } from 'reactstrap'
import Select from 'react-select'
const index = ({ id }) => {
    const [loading, setLoading] = useState(false)
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [dateRange, setDateRange] = useState({
        firstDate: '',
        lastDate: ''
    })
    const months = [
        {value: 0, label: 'January 2024'},
        {value: 1, label: 'February 2024'},
        {value: 2, label: 'March 2024'},
        {value: 3, label: 'April 2024'},
        {value: 4, label: 'May 2024'},
        {value: 5, label: 'June 2024'},
        {value: 6, label: 'July 2024'},
        {value: 7, label: 'August 2024'},
        {value: 8, label: 'September 2024'},
        {value: 9, label: 'October 2024'},
        {value: 10, label: 'November 2024'},
        {value: 11, label: 'December 2024'}
    ]
    const currentMonth = new Date().getMonth()
    const getData = async () => {
        setLoading(true)
        if (id) {
            const formData = new FormData()
            if (dateRange.firstDate !== '' && dateRange.lastDate !== '') {
                formData['start_date'] = dateRange.firstDate
                formData['end_date'] = dateRange.lastDate
            }
            await Api.jsonPost(`/attendance/count/${id}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const resultData = result.data
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
 useEffect(() => {
    getData()
  }, [dateRange])
 function getFirstAndLastDate(month) {
    // Ensure month is in the correct range (0-11 for Jan-Dec)
    const year = new Date().getFullYear()
    if (month < 0 || month > 11) {
      throw new Error('Month must be between 0 (January) and 11 (December).')
    }
  
    // Get the first date of the month
    const firstDate = new Date(year, month, 1)
  
    // Get the last date of the month by setting the day to 0 of the next month
    const lastDate = new Date(year, month + 1, 0)
  
    return {
      firstDate,
      lastDate
    }
  }
  const onMonthChange = e => {
    console.warn(e)
    if (e.value !== "") {
        console.warn(e.value)
      const {firstDate, lastDate}  = getFirstAndLastDate(e.value)
      setDateRange((prev) => ({
        ...prev,
        firstDate: Api.formatDate(firstDate),
        lastDate: Api.formatDate(lastDate)
      }))
      }
  }
  // Example usage:
//   const year = 2024;
//   const month = 8; // September (0-based index)
//   const { firstDate, lastDate } = getFirstAndLastDate(year, month)
//   console.log(`First Date: ${firstDate}`)
//   console.log(`Last Date: ${lastDate}`)
  
  return (
    <Fragment>
        <div className='d-flex justify-content-between'>
            <div>
                <h3>Attendance</h3>
            </div>
            <div>
                <Select
                    className='w-100'
                    type="text"
                    placeholder="Select Month"
                    name="month"
                    options={months}
                    defaultValue={months[currentMonth]}
                    onChange={(e) => {
                        onMonthChange(e)
                    }}
                    menuPlacement="auto"
                />
            </div>
        </div>
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