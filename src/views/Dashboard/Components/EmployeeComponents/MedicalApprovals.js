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
import { FaSuitcaseMedical } from "react-icons/fa6"
import { FaHandHoldingMedical } from "react-icons/fa"
// ** Icons Imports
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'

// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const MedicalApprovals = ({ data, medical_count }) => {
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
            <a href='../statusrequests/'><Avatar className='rounded mb-2' color='light-primary' icon={<FaHandHoldingMedical size={20}/>} /></a>
                <div>
                <h6 className='transaction-title text-white'>{item.status.toUpperCase()}</h6>
                <small className='text-white'> {`Rs ${item.amount}`} <br/> {medical_count ? <> {medical_count.remaining_allowance} / {medical_count.emp_yearly_limit} </> : null } </small>
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
        <CardTitle tag='h5' className='text-white'><FaSuitcaseMedical color='#fff' size={'22'} /> Medical</CardTitle>
        <Icon.ArrowDown size={18} color='white'  />
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
                            <Avatar className='rounded mb-2' color='light-secondary' icon={<FaHandHoldingMedical size={20} color='white'/>} />
                            <div>
                            <h6 className='transaction-title text-white'>No Medical Request Found!</h6>
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
