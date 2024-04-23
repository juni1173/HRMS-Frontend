// ** Custom Components
import Avatar from '@components/avatar'
import SwiperCore, {
    Grid,
    Lazy,
    Virtual,
    Autoplay,
    Navigation,
    Pagination,
    EffectFade,
    EffectCube,
    EffectCoverflow
  } from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react/swiper-react'
// ** Icons Imports
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'

// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const MedicalApprovals = ({ data }) => {

    const params = {
        className: ' p-1',
        slidesPerView: 'auto',
        spaceBetween: 50,
        centeredSlides: true,
        navigation: true,
        slideToClickedSlide: true
      }

  const renderPendingLeavesApprovals = () => {
    return data.map(item => {
      return (
        <SwiperSlide className='rounded swiper-shadow'>
            <div key={item.id} className=''>
            <div className='text-center'>
            <a href='../statusrequests/'><Avatar className='rounded mb-2' color='light-primary' icon={<Icon.Calendar/>} /></a>
                <div>
                <h6 className='transaction-title'>{item.employee_name.toUpperCase()}</h6>
                <small> {`Rs ${item.amount}`}</small>
                </div>
            </div>
            </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Card className='card-transaction' style={{height:'250px'}}>
      <CardHeader>
      <Badge pill color='primary' className='badge-up'>
          {data.length}
        </Badge>
        <CardTitle tag='h4'>Medical Approvals</CardTitle>
        <a href='../statusrequests/'><Icon.ArrowRight size={18} className='cursor-pointer' /></a>
      </CardHeader>
        <CardBody>
        <Swiper {...params}>
                {data && data.length > 0 ? (
                    renderPendingLeavesApprovals()
                ) : (
                    <SwiperSlide className='rounded swiper-shadow'>
                        <div className='text-center'>
                            <Avatar className='rounded mb-2' color='light-secondary' icon={<Icon.Calendar/>} />
                            <div>
                            <h6 className='transaction-title'>No Medical Request Found!</h6>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
        </CardBody>
    </Card>
  )
}

export default MedicalApprovals
