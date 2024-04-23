import { Fragment, useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import apiHelper from '../../../Helpers/ApiHelper'
import { Spinner, Badge } from 'reactstrap'

export default function EventsCalender() {
    const Api = apiHelper()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)


    const getData = async () => {
        setLoading(true)
        try {
            const result = await Api.get(`/current/month/joining/date/`)
            if (result && result.status === 200) {
                const currentDate = new Date()
                const currentYear = currentDate.getFullYear()
                
                const resultData = result.data
                console.log("Result data:", resultData) // Log the received data
                
                // Map the data, replacing the year part with the current year
                const mappedData = resultData.map(item => {
                    const [, month, date] = item.joining_date.split('-')
                    return {
                        title: item.name,
                        start: new Date(`${currentYear}-${month}-${date}`)
                    }
                })
    
                console.log("Mapped data:", mappedData) // Log the mapped data
                
                setEvents(mappedData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }
    function renderEventContent(eventInfo) {
        const { event } = eventInfo
        return (
            <>
            <div className="event-badge-container">
                <Badge color='light-primary'>
                    {event.title}'s<br></br> Anniversary
                </Badge>
                
            </div>
            </>
        )
    }
    
    useEffect(() => {
        getData()
    }, []) // Empty dependency array to ensure getData() only runs once on component mount

    return (
        <Fragment>
            <div>
                {!loading ? (
                    <FullCalendar
                        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView='dayGridMonth'
                        weekends={true}
                        events={events}
                        eventContent={renderEventContent}
                    />
                ) : (
                    <div className='text-center'><Spinner /></div>
                )}
            </div>
        </Fragment>
    )
}
