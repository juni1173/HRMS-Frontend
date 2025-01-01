import React, { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import Avatar from '@components/avatar'
import apiHelper from '../../../Helpers/ApiHelper'
import PerfectScrollbar from 'react-perfect-scrollbar'
import '@styles/react/apps/app-todo.scss'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'

const TimeLogList = ({ LogData, formatName }) => {
    const Api = apiHelper()
  return (
    <Fragment>
  <PerfectScrollbar
    className='list-group todo-task-list-wrapper'
    options={{ wheelPropagation: false }}
    containerRef={(ref) => {
      if (ref) {
        ref._getBoundingClientRect = ref.getBoundingClientRect

        ref.getBoundingClientRect = () => {
          const original = ref._getBoundingClientRect()
          return { ...original, height: Math.floor(original.height) }
        }
      }
    }}
    style={{ maxHeight: '300px', overflowY: 'auto' }} // Added inline styles for height and scrolling
  >
    {LogData && LogData.length > 0 ? (
      <>
        {LogData.reverse().map((log) => (
          log.hours_spent > 0 && (
            <Row key={log.id} style={{borderBottom:'1px solid lightgray', paddingBottom:'5px', paddingTop:'5px'}}>
              <Col md="2" className='md'>
                {log.profile_image ? (
                    <Avatar img={log.profile_image}/>
                ) : (log.employee_name ? (
                    <Avatar color='light-primary' content={log.employee_name} initials />
                ) : <Avatar img={defaultAvatar}/>)}
              </Col>
              <Col md="6" className='justify-content-start'>
                <span className='small'>{log.employee_name ? formatName(log.employee_name) : 'N/A'}</span> <br />
                <span className='text-secondary small'>{Api.formatDateWithMonthName(log.date)}</span>
              </Col>
              <Col md="4" className='d-flex justify-content-end'>
                <span className='content-center'>{log.hours_spent % 1 === 0 ? Math.floor(log.hours_spent) : log.hours_spent} hours</span>
              </Col>
            </Row>
          )
        ))}
      </>
    ) : (
      <span className='text-muted small'>No time logs found.</span>
    )}
  </PerfectScrollbar>
</Fragment>

  )
}

export default TimeLogList