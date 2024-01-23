import React, { Fragment, useEffect, useState } from 'react'
import { Label, Input } from 'reactstrap'
import SessionActivityCalendar from './sessionActivityCal'
import apiHelper from '../../../Helpers/ApiHelper'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [events] = useState([])
    const getEvents =  async () => {
      setLoading(true)
       await  Api.get(`/instructors/session/`).then(result => {
        if (result) {
          if (result.status === 200) {
              const item = result.data
              for (let i = 0; i < item.length; i++) {
                events.push({id: item[i].id, title: item[i].course_title ? item[i].course_title : null, start: item[i].start_date ? new Date(item[i].start_date) : '', end: item[i].end_date ? new Date(item[i].end_date) : '', session_status: item[i].session_status ? item[i].session_status : 'N/A'})
              }
          }
          
        }
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
    }
    useEffect(() => {
      getEvents()
    }, [events])
   
     
  return (
    <Fragment>
        <div className='row'>
        <div className='col-md-12'>
            <div className='mt-3 d-flex'>
              
              <div className='form-check form-check-danger m-1 mt-0'>
                <Input type='radio' id='radio-danger' defaultChecked />
                <Label className='form-check-label' for='radio-danger'>
                Not initiated
                </Label>
              </div>
              <div className='form-check form-check-warning m-1 mt-0'>
                <Input type='radio' id='radio-warning' defaultChecked />
                <Label className='form-check-label' for='radio-warning'>
                  In Progress
                </Label>
              </div>
              <div className='form-check form-check-success m-1 mt-0'>
                <Input type='radio' id='radio-success' defaultChecked />
                <Label className='form-check-label' for='radio-success'>
                  Completed
                </Label>
              </div>
            </div>
            </div>
            <div className='col-md-12'>
                {(events.length > 0 && !loading) && (
                  <SessionActivityCalendar events={events}/>
                )}
               
            </div>
        </div>
    </Fragment>
  )
}

export default index