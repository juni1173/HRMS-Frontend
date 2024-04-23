// ** Reactstrap Imports
import { Card, CardBody, CardText, CardTitle } from 'reactstrap'
import Avatar from '@components/avatar'
import { Calendar, MapPin } from 'react-feather'
// ** Images
import Ess_illustration from '@src/assets/images/illustration/marketing.svg'

const UpcomingInterview = () => {
    
  return (
  
        <Card className='card-developer-meetup' style={{height:'530px'}}>
            <div className='meetup-img-wrapper rounded-top text-center'>
                <img src={Ess_illustration} height='170' />
            </div>
            <CardBody>
                <div className='meetup-header d-flex align-items-center'>
                <div className='my-auto'>
                    <CardTitle tag='h4' className='mb-25'>
                    Upcoming Interview
                    </CardTitle>
                    <CardText className='mb-0'></CardText>
                </div>
                </div>
                <div className='d-flex'>
                <Avatar color='light-primary' className='rounded me-1' icon={<Calendar size={18} />} />
                <div>
                    <h6 className='mb-0'>Sat, May 25, 2020</h6>
                    <small>10:AM to 6:PM</small>
                </div>
                </div>
                <div className='d-flex mt-2'>
                <Avatar color='light-primary' className='rounded me-1' icon={<MapPin size={18} />} />
                <div>
                    <h6 className='mb-0'>Central Park</h6>
                    <small>Manhattan, New york City</small>
                </div>
                </div>
            </CardBody>
        </Card>
            
  )
}

export default UpcomingInterview
