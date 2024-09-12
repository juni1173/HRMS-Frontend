import { Fragment, useState, useEffect } from 'react'
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import listPlugin from '@fullcalendar/list'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
import user_blank  from "../../../../assets/images/avatars/user_blank.png"
import apiHelper from '../../../Helpers/ApiHelper'
import Avatar from '@components/avatar'
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody } from 'reactstrap'
import { GiGlassCelebration } from "react-icons/gi"
import { FaBirthdayCake } from "react-icons/fa"
export default function EventsCalender() {
    const Api = apiHelper()
    // const [events, setEvents] = useState([])
    const [anniversaries, setAnniversaries] = useState([])
    const [birthdays, setBirthdays] = useState([])
    const [loading, setLoading] = useState(false)

    const [active, setActive] = useState('1')

    const toggle = tab => {
      setActive(tab)
    }
    const getData = async () => {
        setLoading(true)
        try {
            const result = await Api.jsonPost(`/month/joining/dob/date/`, {})
            if (result && result.status === 200) {
                // const currentDate = new Date()
                // const currentYear = currentDate.getFullYear()
                
                const resultData = result.data
                setAnniversaries(resultData.joining_date_data)
                setBirthdays(resultData.dob_data)
                console.log("Result data:", resultData) // Log the received data
                
                // Map the data, replacing the year part with the current year
                // const mappedData = resultData.map(item => {
                //     const [, month, date] = item.joining_date.split('-')
                //     return {
                //         title: item.name,
                //         start: new Date(`${currentYear}-${month}-${date}`)
                //     }
                // })
    
                // console.log("Mapped data:", mappedData) // Log the mapped data
                
                // setEvents(mappedData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }
    // function renderEventContent(eventInfo) {
    //     const { event } = eventInfo
    //     return (
    //         <>
    //         <div className="event-badge-container">
    //             <Badge color='light-primary'>
    //                 {event.title}'s<br></br> Anniversary
    //             </Badge>
                
    //         </div>
    //         </>
    //     )
    // }
    // const renderAnniversaries = () => {
    //         return anniversaries.map(state => {
    //           return (
    //             <div key={state.id} className='browser-states'>
    //               <div className='d-flex'>
    //                 <img className='rounded me-1' src={state.profile_image} height='30' alt={state.name} />
    //                 <h6 className='align-self-center mb-0'>{state.name}</h6>
    //               </div>
    //               <div className='align-items-center'>
    //                 <div className='fw-bold text-body-heading me-1'>{state.joining_date}</div>
    //               </div>
    //             </div>
    //           )
    //         })
          
    // }
//     const renderBirthdays = () => {
//         return birthdays.map(state => {
//           return (
//             <div key={state.id} className='browser-states'>
//               <div className='d-flex'>
//                 <img className='rounded me-1' src={state.profile_image} height='30' alt={state.name} />
//                 <h6 className='align-self-center mb-0'>{state.name}</h6>
//               </div>
//               <div className='align-items-center'>
//                 <div className='fw-bold text-body-heading me-1'>{state.dob}</div>
//               </div>
//             </div>
//           )
//         })
      
// }
    
    useEffect(() => {
        getData()
    }, []) // Empty dependency array to ensure getData() only runs once on component mount

    return (
        <Fragment>
            <Card className='card-browser-states'>
                <CardBody>
                    <Nav pills justified>
                <NavItem>
                <NavLink
                    active={active === '1'}
                    onClick={() => {
                    toggle('1')
                    }}
                >
                    <GiGlassCelebration color={active === '1' ? '#fff' : '#315180'} size={'24'}  /> Anniversaries
                </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                    active={active === '2'}
                    onClick={() => {
                    toggle('2')
                    }}
                >
                    <FaBirthdayCake color={active === '2' ? '#fff' : '#315180'} size={'24'}  /> Birthdays
                </NavLink>
                </NavItem>
                
                    </Nav>
                    <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId='1'>
                        
                        {!loading ? (
                                anniversaries.map(state => (
                                    <div key={state.id} className='browser-states'>
                                <div className='d-flex'>
                                <Avatar img={state.profile_image ? state.profile_image : user_blank}/>
                                    <h6 className='align-self-center mb-0'>{state.name}</h6>
                                </div>
                                <div className='align-items-center'>
                                    <div className='fw-bold text-body-heading me-1'>{state.joining_date}</div>
                                </div>
                                </div>
                                ))
                            ) : <div className="text-center"><Spinner/></div>}
                            
                        </TabPane>
                        <TabPane tabId='2'>
                        
                                {!loading ? (
                                birthdays.map(state => (
                                    <div key={state.id} className='browser-states d-flex justify-content-between'>
                                        <div className='d-flex'>
                                            <Avatar img={state.profile_image ? state.profile_image : user_blank}/>
                                            
                                            <h6 className='align-self-center mb-0'>{state.name}</h6>
                                        </div>
                                        <div className='align-items-center'>
                                            <div className='fw-bold text-body-heading me-1'>{state.dob}</div>
                                        </div>
                                    </div>
                                ))
                            ) : <div className="text-center"><Spinner/></div>}
                        
                        
                        </TabPane>
                    
                    </TabContent>
                </CardBody>
            </Card>
               
            {/* <div>
                   
                         
                {!loading ? (
                    <>
                        {Object.values(data).length > 0 ? (
                        Object.values(data).map((i, key) => (
                            <div key={key}>
                                <p>{i.name}</p>
                                <p>{i.joining_date}</p>
                            </div>
                            
                        ))) : null} */}
                        {/* <FullCalendar
                            plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView='dayGridMonth'
                            weekends={true}
                            events={events}
                            eventContent={renderEventContent}
                        /> */}
                    {/* </>
                ) : (
                    <div className='text-center'><Spinner /></div>
                )}
            </div> */}
        </Fragment>
    )
}
