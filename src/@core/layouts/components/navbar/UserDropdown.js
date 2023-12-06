// ** React Imports
import { Link, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'

const UserDropdown = () => {
  // ** State
  // const [userData] = useState(null)
  const dispatch = useDispatch()
  const [userData, setUserData] = useState(null)
  // const history = useHistory()
  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      if (JSON.parse(localStorage.getItem('userData'))) {
        if (JSON.parse(localStorage.getItem('userData')).user_role === 'employee') {
          setUserData(JSON.parse(localStorage.getItem('user')))
       } else {
        setUserData(JSON.parse(localStorage.getItem('user')))
       }
      }
    }
  }, [])
  let userAvatar = ''
  //** Vars
  if (JSON.parse(localStorage.getItem('userData'))) {
    if (JSON.parse(localStorage.getItem('userData')).user_role === 'employee') {
      userAvatar = JSON.parse(localStorage.getItem('user')) ? (JSON.parse(localStorage.getItem('user')).profile_image ? JSON.parse(localStorage.getItem('user')).profile_image : defaultAvatar) : defaultAvatar
   } else {
      userAvatar = JSON.parse(localStorage.getItem('user')) ? (JSON.parse(localStorage.getItem('user')).profile_image ? JSON.parse(localStorage.getItem('user')).profile_image : defaultAvatar) : defaultAvatar
   }
  } else {
    return <Redirect to='/' />
  }
  
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData.name) || 'user'}</span>
          <span className='user-status'>{localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).user_role : ''}</span>
        </div>
        <Avatar img={userAvatar !== '' ? `${process.env.REACT_APP_PUBLIC_URL}${userAvatar}` : defaultAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
      {JSON.parse(localStorage.getItem('userData')).user_role === 'employee' && (
            <DropdownItem tag='a' href={`/employee_profile`}>
              <User size={14} className='me-75' />
              <span className='align-middle'>Profile</span>
            </DropdownItem>
          )}
        
        {/* <DropdownItem tag='a' href='/apps/email' onClick={e => e.preventDefault()}>
          <Mail size={14} className='me-75' />
          <span className='align-middle'>Inbox</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/todo' onClick={e => e.preventDefault()}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>Tasks</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/chat' onClick={e => e.preventDefault()}>
          <MessageSquare size={14} className='me-75' />
          <span className='align-middle'>Chats</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag='a' href='/pages/account-settings' onClick={e => e.preventDefault()}>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/pricing' onClick={e => e.preventDefault()}>
          <CreditCard size={14} className='me-75' />
          <span className='align-middle'>Pricing</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/faq' onClick={e => e.preventDefault()}>
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>FAQ</span>
        </DropdownItem> */}
        
        <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
