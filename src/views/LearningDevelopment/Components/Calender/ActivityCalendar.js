import { Fragment, useState } from 'react'
import { Badge, Offcanvas, OffcanvasHeader, OffcanvasBody} from 'reactstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import LectureView from './LectureView'
// const events = [{ title: 'Meeting', start: new Date() }]
// a custom render function

export default function ActivityCalendar({ events }) {
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
    if (status === 1) {
        color = 'info'
    } else if (status === 4) {
        color = 'success'
    } else if (status === 3) {
      color = 'dark'
    } else {
      color = 'danger'
    }
  
    return color
  }

    function renderEventContent(eventInfo) {
        return (
          <>
            <Badge color={getColor(eventInfo.event.extendedProps.status)}>{eventInfo.event.title}</Badge>
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
          eventContent={renderEventContent}
          eventClick={eventClick}
        />
      </div>
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="Job-Form-Canvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <LectureView id={id}/>
          </OffcanvasBody>
        </Offcanvas>
  </Fragment>
  )
}

