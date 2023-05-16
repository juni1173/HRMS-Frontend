import { Fragment, useState } from 'react'
import { Badge, Offcanvas, OffcanvasHeader, OffcanvasBody} from 'reactstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import SessionView from './SessionView'
// const events = [{ title: 'Meeting', start: new Date() }]
// a custom render function

export default function SessionActivityCalendar({ events }) {
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [id, setID] = useState(null)
  const toggleCanvasEnd = () => {
    
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    // CallBack()
  }
 
  function eventClick(eventInfo) {
    setID(eventInfo.event.id)
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  const getColor = status => {
    let color = ''
    if (status === 'Not initiated') {
        color = 'danger'
    } else if (status === 'InProgress') {
        color = 'success'
    } else if (status === 'Completed') {
      color = 'warning'
    } else {
      color = 'danger'
    }
   
    return color
  }
  function getEventColor(eventInfo) {
    let color = ''
    if (eventInfo.event.extendedProps.session_status === 'Not initiated') {
        color = 'red'
    } else if (eventInfo.event.extendedProps.session_status === 'InProgress') {
        color = 'orange'
    } else if (eventInfo.event.extendedProps.session_status === 'Completed') {
      color = 'green'
    } else {
      color = 'lightblue'
    }
   
    return color
  }
  function getRange(eventInfo) {
    return { start: eventInfo.event.start, end: eventInfo.event.end }
  }
    function renderEventContent(eventInfo) {
        return (
          <>
            <Badge color={getColor(eventInfo.event.extendedProps.session_status)}>{eventInfo.event.title}</Badge>
          </>
        )
      }
  return (
    <Fragment>
      <div>
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView='dayGridMonth'
          weekends={true}
          events={events}
          visibleRange={getRange}
          eventContent={renderEventContent}
          eventClick={eventClick}
          eventBackgroundColor={getEventColor}
        />
      </div>
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="Job-Form-Canvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <SessionView id={id}/>
          </OffcanvasBody>
        </Offcanvas>
  </Fragment>
  )
}

