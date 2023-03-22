// ** React Imports
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

const VerticalMenuHeader = props => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props
  // const { menuCollapsed, setGroupOpen, menuHover } = props
  const [orgImgPath, setOrgImgPath] = useState(null)
  
  const checkImage = () => {
    const imageUrl = process.env.REACT_APP_BACKEND_URL + JSON.parse(localStorage.getItem('organization')).logo
    const img = new Image()
      img.src = imageUrl
      if (img.complete) {
      setOrgImgPath(imageUrl)
      } else {
        setOrgImgPath(null)
      }
    }
  // ** Reset open group
  useEffect(() => {
    if (localStorage.getItem('organization')) {
      checkImage()
    }
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className='brand-text toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className='brand-text toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <div className='row'>
            <div className='col-lg-10 col-md-10 col-sm-10'>
            <NavLink to='/' className='navbar-brand'>
            <span className='brand-logo'>
              <img src={orgImgPath !== null ? orgImgPath : themeConfig.app.appLogoImage} alt='logo' />
            </span>
            <h3 className='brand-text mb-0'>{(JSON.parse(localStorage.getItem('organization'))) ? JSON.parse(localStorage.getItem('organization')).name : themeConfig.app.appName}</h3>
          </NavLink>
            </div>
            <div className='col-lg-2 col-md-2 col-sm-2'>
            <div className=' modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
          </div>
            </div>
            </div>
        </li>
        {/* <li className='nav-item nav-toggle'>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
          </div>
        </li> */}
      </ul>
    </div>
  )
}
VerticalMenuHeader.defaultProps = {
  setMenuCollapsed:false,
  setMenuVisibility:true
}
export default VerticalMenuHeader
