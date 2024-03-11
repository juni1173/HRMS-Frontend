import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, Card, CardBody} from "reactstrap"
 import apiHelper from "../../Helpers/ApiHelper"
import HRTicketsList from "./Components/HRTicketsList"
const index = () => {
    
    // const [countData, setCountData] = useState([])
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [ticketData, setTicketData] = useState([])
    
   
      const getTicketData = async () => {
        setLoading(true)
        await Api.get(`/ticket/hr/ticket/requests/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    setTicketData(data) 
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
        {!loading ? (
            (ticketData && Object.values(ticketData).length > 0) ? (
                <HRTicketsList data={ticketData} CallBack={CallBack} type="hr-tickets"/>
            ) : (
                <Card>
                    <CardBody>
                        <div className="text-center">No Tickets Found!</div>
                    </CardBody>
                </Card>
            
            )
        ) : <div className="text-center"><Spinner/></div>}
        
    </Fragment>
   )
}
export default index