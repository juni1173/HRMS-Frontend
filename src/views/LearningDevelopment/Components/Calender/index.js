import React, { Fragment, useEffect, useState } from 'react'
import { Label, Input } from 'reactstrap'
import ActivityCalendar from './ActivityCalendar'
import apiHelper from '../../../Helpers/ApiHelper'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [events] = useState([])
    const getEvents =  async () => {
      setLoading(true)
       await  Api.get(`/instructors/get/all/lectures/`).then(result => {
        if (result) {
          if (result.status === 200) {
              const item = result.data
              for (let i = 0; i < item.length; i++) {
                events.push({id: item[i].id, title: item[i].title ? item[i].title : null, start: item[i].date ? new Date(item[i].date) : '', status: item[i].status ? item[i].status : '', date: item[i].date ? item[i].date : 'N/A', start_time: item[i].start_time ? item[i].start_time : 'N/A', duration: item[i].duration ? item[i].duration : 'N/A', status_title: item[i].status_title ? item[i].status_title : 'N/A', mode_of_instruction_title: item[i].mode_of_instruction_title ? item[i].mode_of_instruction_title : 'N/A', instructor_name: item[i].instructor_name ? item[i].instructor_name : 'N/A', description: item[i].description ? item[i].description : 'N/A' })
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
        <div className='col-md-2'>
            <div className='mt-3'>
              <div className='form-check form-check-info mb-1'>
              <Input type='radio' id='radio-info' defaultChecked />
              <Label className='form-check-label' for='radio-info'>
                Scheduled
              </Label>
              </div>
              <div className='form-check form-check-danger mb-1'>
                <Input type='radio' id='radio-danger' defaultChecked />
                <Label className='form-check-label' for='radio-danger'>
                  Not Scheduled
                </Label>
              </div>
              <div className='form-check form-check-dark mb-1'>
                <Input type='radio' id='radio-dark' defaultChecked />
                <Label className='form-check-label' for='radio-dark'>
                  In Progress
                </Label>
              </div>
              <div className='form-check form-check-success mb-1'>
                <Input type='radio' id='radio-success' defaultChecked />
                <Label className='form-check-label' for='radio-success'>
                  Completed
                </Label>
              </div>
            </div>
            </div>
            <div className='col-md-10'>
                {(events.length > 0 && !loading) && (
                  <ActivityCalendar events={events}/>
                )}
               
            </div>
        </div>
    </Fragment>
  )
}

export default index