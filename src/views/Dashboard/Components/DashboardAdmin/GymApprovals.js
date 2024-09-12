// ** Custom Components
import { useState } from 'react'
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
import { CgGym } from "react-icons/cg"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'
import { GiStrongMan } from "react-icons/gi"
// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const MedicalApprovals = ({ data }) => {
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
            <a href='../statusrequests/'><Avatar className='rounded mb-2' color='light-primary' icon={<CgGym size={20} color='white'/>} /></a>
                <div>
                <h6 className='transaction-title text-white'>{item.employee_name.toUpperCase()}</h6>
                <small className='text-white'> {`Rs ${item.amount}`}</small>
                </div>
            </div>
            </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Card className='card-transaction cursor-pointer mb-1'  style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}}>
      <CardHeader className='p-1' onClick={toggleCardBody}>
      <Badge pill style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}} className='badge-up'>
          {data.length}
        </Badge>
        <CardTitle tag='h5' className='text-white'><GiStrongMan color='#fff' size={'24'}/> Gym Approvals</CardTitle>
        <Icon.ArrowDown size={18} color='white'  />
        {/* <a href='../statusrequests/'></a> */}
      </CardHeader>
      {isCardBodyVisible && (
        <CardBody>
        <Swiper {...params}>
                {data && data.length > 0 ? (
                    renderPendingLeavesApprovals()
                ) : (
                    <SwiperSlide className='rounded swiper-shadow'>
                        <div className='text-center'>
                            <Avatar className='rounded mb-2' color='light-secondary' icon={<CgGym size={20} color='white'/>} />
                            <div>
                            <h6 className='transaction-title text-white'>No Gym Request Found!</h6>
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

export default MedicalApprovals
