import React, { Fragment, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
const index = () => {
    const [selectedDate, setSelectedDate] = useState('')
    const calendarOptions = {
        // events: store.events.length ? store.events : [],
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          start: 'prev,next',
          center: 'title',
          end: 'dayGridMonth'
        },
        /*
          Enable dragging and resizing event
          ? Docs: https://fullcalendar.io/docs/editable
        */
        editable: true,
    
        /*
          Enable resizing event from start
          ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
        */
        eventResizableFromStart: false,
    
        /*
          Automatically scroll the scroll-containers during event drag-and-drop and date selecting
          ? Docs: https://fullcalendar.io/docs/dragScroll
        */
        dragScroll: false,
    
        /*
          Max number of events within a given day
          ? Docs: https://fullcalendar.io/docs/dayMaxEvents
        */
        dayMaxEvents: 3,
    
        /*
          Determines if day names and week names are clickable
          ? Docs: https://fullcalendar.io/docs/navLinks
        */
        navLinks: true,
    
        eventClassNames({ event: calendarEvent }) {
          // eslint-disable-next-line no-underscore-dangle
          const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
    
          return [
            // Background Color
            `bg-light-${colorName}`
          ]
        },
    
        // eventClick({ event: clickedEvent }) {
        //   dispatch(selectEvent(clickedEvent))
        //   handleAddEventSidebar()
    
          // * Only grab required field otherwise it goes in infinity loop
          // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
          // event.value = grabEventDataFromEventApi(clickedEvent)
    
          // eslint-disable-next-line no-use-before-define
          // isAddNewEventSidebarActive.value = true
        // },
    
        // customButtons: {
        //   sidebarToggle: {
        //     text: <Menu className='d-xl-none d-block' />,
        //     click() {
        //       toggleSidebar(true)
        //     }
        //   }
        // },
    
        dateClick(info) {
          setSelectedDate(info.dateStr)
        //   handleAddEventSidebar()
        }
    
        /*
          Handle event drop (Also include dragged event)
          ? Docs: https://fullcalendar.io/docs/eventDrop
          ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */
        // eventDrop({ event: droppedEvent }) {
        //   dispatch(updateEvent(droppedEvent))
         
        // },
    
        /*
          Handle event resize
          ? Docs: https://fullcalendar.io/docs/eventResize
        */
        // eventResize({ event: resizedEvent }) {
        //   dispatch(updateEvent(resizedEvent))
        //   toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        //     icon: false,
        //     autoClose: 2000,
        //     hideProgressBar: true,
        //     closeButton: false
        //   })
        // },
    
        // ref: calendarRef,
    
        // // Get direction from app state (store)
        // direction: isRtl ? 'rtl' : 'ltr'
      }
  return (
    <Fragment>
        <div className='row'>
            <div className='col-lg-6'>
                {selectedDate && (<p>{selectedDate}</p>)}
                <FullCalendar {...calendarOptions} />
            </div>
        </div>
    </Fragment>
  )
}

export default index