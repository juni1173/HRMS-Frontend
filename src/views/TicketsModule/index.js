import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from "reactstrap"
 import apiHelper from "../Helpers/ApiHelper"
import AddTicket from "./Components/AddTicket"
import AssignedTickets from "./Components/Admin/AssignedTickets"
import TransferTickets from "./Components/Admin/TransferTickets"
import AssignedList from "./Components/AssignedList"
import LeadApprovals from "./Components/LeadApprovals"
import TicketList from "./Components/TicketList"
const TicketsModule = () => {
    
    const [active, setActive] = useState('1')
    // const [countData, setCountData] = useState([])
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState([])
    
    const toggle = tab => {
        setActive(tab)
      }
      const getTicketData = async () => {
        setLoading(true)
        await Api.get(`/ticket/employee/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    setTicketData(data)
                    // await Api.get(`/ticket/counts/data/`).then(cresult => {
                    //     if (cresult) {
                    //         if (cresult.status === 200) {
                    //             const cdata = cresult.data
                    //             setCountData(cdata)
                    //         } else {
                    //             // Api.Toast('error', result.message)
                    //         }
                    //     } else (
                    //      Api.Toast('error', 'Server not responding!')   
                    //     )
                    // }) 
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        }) 
         
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
   
    useEffect(() => {
        getTicketData()
        }, [])

        const CallBack = useCallback(() => {
            getTicketData()
          }, [ticketData])
   return (
    <Fragment>
        <AddTicket CallBack={CallBack} toggle={toggle} active={active}/>
        
            <TabContent className='py-50' activeTab={active}>
            <TabPane tabId={'1'}>
                {!loading ? (
                    active === '1' ? <TicketList data={ticketData} CallBack={CallBack} type="tickets"/> : null
                ) : (
                    <div className="text-center"><Spinner/></div> 
                )}
                
            </TabPane>
            <TabPane tabId={'2'}>
            {!loading ? (
                    active === '2' ? <LeadApprovals type="lead"/> : null
                ) : (
                    <div className="text-center"><Spinner/></div> 
                )}
                
            </TabPane>
            <TabPane tabId={'3'}>
            {!loading ? (
                    active === '3' ? <AssignedTickets type="assigned"/> : null
                ) : (
                    <div className="text-center"><Spinner/></div> 
                )}
                
            </TabPane>
            <TabPane tabId={'4'}>
            {!loading ? (
                    active === '4' ? <TransferTickets type="transfer"/> : null
                ) : (
                    <div className="text-center"><Spinner/></div> 
                )}
                
            </TabPane>
            </TabContent>
    </Fragment>
   )
}
export default TicketsModule