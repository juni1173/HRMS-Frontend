// ** Third Party Components
import { Item } from 'react-contexify'
import { FileText } from 'react-feather'
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  Badge,
  Button,
  Row,
  Col
} from 'reactstrap'
const LeavesCount = ({ data }) => {
  const renderStates = (data) => {
    
      return (
        <>
        {data && Object.values(data).length > 0 ? (
data.map((item, key) => (
<div key={key} className='browser-states'>
  <div className="col-md-12 text-start">
      <h6 className="fw-bold no-wrap">{item.leave_type}</h6>
      <Row>
      <div className="col-md-6">
        <Badge color='success'>
          {item.allowed_leaves}
        </Badge>
        <p className='nowrap'>Allowed</p>
      </div>
    <div className="col-md-6" >
      <Badge color='danger'>
        {item.remaining_leaves}
      </Badge>
      <p className='nowrap'>Remaining</p>
    </div>
</Row>
  </div>
</div>
            ))
        ) : (
            <div className='text-center'>No Leaves Count data</div> 
        )}
       
        </>
        
      )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Leaves Count</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        {renderStates(data)}
        </CardBody>
    </Card>
  )
}

export default LeavesCount
