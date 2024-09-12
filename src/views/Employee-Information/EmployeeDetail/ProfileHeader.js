// ** React Imports
import { useState } from 'react'

// ** Icons Imports
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button } from 'reactstrap'
import banner from '../../../assets/images/profile-banner.jpg'
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import UserTabs from './UserTabs'
const ProfileHeader = ({ active, toggleTab, empData, CallBack, url_params }) => {
  // ** States
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Card className='profile-header mb-2'>
      <CardImg style={{height:'150px'}} src={banner ? banner : user_blank} alt='User Profile Image' top />
      <div className='position-relative'>
        <div className='profile-img-container d-flex align-items-center'>
          <div className='profile-img'>
            <img className='rounded img-fluid' src={empData.employee.profile_image ? empData.employee.profile_image : user_blank} alt='Card image' />
          </div>
          <div className='profile-title ms-3'>
            <h2 className='text-white'>{empData.employee.name ? empData.employee.name : 'N/A'}</h2>
            <p className='text-white'>{empData.employee.position_title ? empData.employee.position_title : 'No position found!'}</p>
          </div>
        </div>
      </div>
      <div className='profile-header-nav'>
        <Navbar container={false} className='justify-content-end justify-content-md-between w-100' expand='md' light>
          <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
            <AlignJustify size={21} />
          </Button>
          <Collapse isOpen={isOpen} navbar>
            <div className='profile-tabs justify-content-between flex-wrap mt-1 mt-md-0'>
            <UserTabs active={active} toggleTab={toggleTab} empData={empData} CallBack={CallBack} url_params={url_params}/>
            </div>
          </Collapse>
        </Navbar>
      </div>
    </Card>
  )
}

export default ProfileHeader
