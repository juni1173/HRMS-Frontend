// ** Third Party Components
import { Item } from 'react-contexify'
import { FileText } from 'react-feather'
import { useHistory } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  Badge,
  Button
} from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
const Leaves = ({ data }) => {
    const Api = apiHelper()
    const history = useHistory()
    let date = new Date()
    date = Api.formatDate(date)
    const month = Api.getMonth(date)
  const renderStates = (data) => {
    
      return (
        <>
        {data && Object.values(data).length > 0 ? (
            data.map((item, key) => (
                <div key={key} className='browser-states'>
              <div className='d-flex'>
                {/* <img className='rounded me-1' src={data.avatar} height='30' alt={state.title} /> */}
                <h6 className='rounded me-1 mb-0'><FileText /></h6>
                <h6 className='align-self-center mb-0'>{item.duration} {item.leave_types_title} <span>({item.start_date} - {item.end_date})</span></h6>
              </div>
              <div className='d-flex align-items-center'>
                <div className='fw-bold text-body-heading me-1'><Badge>{item.status}</Badge></div>
              </div>
            </div>
            ))
        ) : (
            <div className='text-center'>No Leaves applied on {month}!</div> 
        )}
       
        </>
        
      )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>ESS Leaves</CardTitle>
          <CardText className='font-small-2'>{date} ({month})</CardText>
        </div>
        <Button className='btn btn-primary' onClick={() => {
            history.push('/requests')
        }}>Details</Button>
      </CardHeader>
      <CardBody>
        {renderStates(data)}
        </CardBody>
    </Card>
  )
}

export default Leaves
