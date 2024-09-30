import { useState } from 'react'
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
import { FcLeave } from "react-icons/fc"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'

// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const LeavesBalance = ({ data }) => {
  const [isCardBodyVisible, setIsCardBodyVisible] = useState(false)
  const toggleCardBody = () => {
    setIsCardBodyVisible(!isCardBodyVisible) // Toggle visibility state
  }
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
        <SwiperSlide className='rounded swiper-shadow' key={item.id}>
            <div className=''>
            <div className='text-center'>
            <a href='../statusrequests/'><Avatar className='rounded mb-2' color='light-primary' icon={<Icon.Calendar color='white'/>} /></a>
                <div>
                {/* <h6 className='transaction-title'>{item.employee_name.toUpperCase()}</h6> */}
                 <h6 className='transaction-title text-white'>{`${item.leave_type}`}</h6>
                <small className='text-white'>{`${item.remaining_leaves} / ${item.allowed_leaves}`}</small>
                </div>
            </div>
            </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Card className='card-transaction cursor-pointer mb-1' style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}}>
      <CardHeader onClick={toggleCardBody} className='p-1'>
        <Badge pill style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}} className='badge-up'>
          {data.length}
        </Badge>
        <CardTitle tag='h5' className='text-white'><FcLeave color='#fff' size={'24'} /> Leaves</CardTitle>
        <Icon.ArrowDown size={18} color='white'/>
        {/* <a href='../requests/'><Icon.ArrowRight size={18} className='cursor-pointer' /></a> */}
      </CardHeader>
      {isCardBodyVisible && (
        <CardBody>
            <Swiper {...params}>
                {data && data.length > 0 ? (
                    renderPendingLeavesApprovals()
                ) : (
                    <SwiperSlide className='rounded swiper-shadow'>
                        <div className='text-center'>
                            <Avatar className='rounded mb-2' color='light-secondary' icon={<Icon.Calendar color='white'/>} />
                            <div>
                            <h6 className='transaction-title text-white'>No Leave Balance Found!</h6>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
        </CardBody>
      )}
    </Card>
  )
}

export default LeavesBalance
