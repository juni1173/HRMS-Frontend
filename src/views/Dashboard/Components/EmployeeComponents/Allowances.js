// ** Third Party Components
import { Shield, FolderPlus } from 'react-feather'
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
const Allowances = ({ data }) => {
    const Api = apiHelper()
    const history = useHistory()
    let date = new Date()
    date = Api.formatDate(date)
    const month = Api.getMonth(new Date())
  const renderStates = (data) => {
    
      return (
        <>
        {data.gym && Object.values(data.gym).length > 0 ? (
            data.gym.map((item, key) => (
                <div key={key} className='browser-states'>
              <div className='d-flex'>
                {/* <img className='rounded me-1' src={data.avatar} height='30' alt={state.title} /> */}
                <h6 className='rounded me-1 mb-0'><Shield /></h6>
                <h6 className='align-self-center mb-0'>Gym</h6>
              </div>
              <div className='d-flex align-items-center'>
                <div className='fw-bold text-body-heading me-1'><Badge>{item.status}</Badge></div>
                <div className='fw-bold text-body-heading me-1'>{item.amount}</div>
              </div>
            </div>
            ))
        ) : (
            <Badge color='light-danger' className='text-center mb-2'>No Gym allowance applied on {month}!</Badge> 
        )}
        {data.medical && Object.values(data.medical).length > 0 ? (
            data.medical.map((item, key) => (
                <div key={key} className='browser-states'>
              <div className='d-flex'>
                {/* <img className='rounded me-1' src={data.avatar} height='30' alt={state.title} /> */}
                <h6 className='rounded me-1 mb-0'><FolderPlus /></h6>
                <h6 className='align-self-center mb-0'>Medical</h6>
              </div>
              <div className='d-flex align-items-center'>
                <div className='fw-bold text-body-heading me-1'><Badge>{item.status}</Badge></div>
                <div className='fw-bold text-body-heading me-1'>{item.amount}</div>
              </div>
            </div>
            ))
        ) : (
            <Badge color='light-danger' className='text-center'>No Medical allowance applied on {month}!</Badge> 
        )}

        </>
        
      )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>ESS Allowances</CardTitle>
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

export default Allowances
