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
import { MdWorkOff } from "react-icons/md"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'

// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const UpcomingHolidays = ({ data }) => {
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
        <SwiperSlide className='rounded swiper-shadow'>
            <div key={item.id} className=''>
            <div className='text-center'>
                <Avatar className='rounded mb-2' color='light-primary' icon={<Icon.Calendar color='white'/>} />
                <div>
                <h6 className='transaction-title text-white'>{item.title.toUpperCase()}</h6>
                <small className='text-white'> {`${item.date && item.date }`}</small>
                </div>
            </div>
            </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Card className='card-transaction cursor-pointer mb-1 p-0' style={{background: 'linear-gradient(to right, #000000, #434343)'}}>
      <CardHeader onClick={toggleCardBody} className='p-1'>
      <Badge pill style={{background: 'linear-gradient(to right, #000000, #434343)'}} className='badge-up'>
          {data.length}
        </Badge>
        <CardTitle tag='h4' className='text-white'><MdWorkOff color='#fff' size={'24'} /> Upcoming Holidays</CardTitle>
        <Icon.ArrowDown size={18} color="white"/>
        {/* <Icon.ArrowRight size={18} className='cursor-pointer' /> */}
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
                            <h6 className='transaction-title text-white'>No Holiday Found</h6>
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

export default UpcomingHolidays
