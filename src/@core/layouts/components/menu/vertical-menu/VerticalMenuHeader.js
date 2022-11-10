// ** React Imports
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

const VerticalMenuHeader = props => {
  // ** Props
  // const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props
  const { menuCollapsed, setGroupOpen, menuHover } = props
  const [orgImgPath, setOrgImgPath] = useState(null)
  
  
  // ** Reset open group
  useEffect(() => {
    if (localStorage.getItem('organization')) {
      setOrgImgPath(process.env.REACT_APP_BACKEND_URL + JSON.parse(localStorage.getItem('organization')).logo)
    }
    
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  // const Toggler = () => {
  //   if (!menuCollapsed) {
  //     return (
  //       <Disc
  //         size={20}
  //         data-tour='toggle-icon'
  //         className='text-primary toggle-icon d-none d-xl-block'
  //         onClick={() => setMenuCollapsed(true)}
  //       />
  //     )
  //   } else {
  //     return (
  //       <Circle
  //         size={20}
  //         data-tour='toggle-icon'
  //         className='text-primary toggle-icon d-none d-xl-block'
  //         onClick={() => setMenuCollapsed(false)}
  //       />
  //     )
  //   }
  // }

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink to='/' className='navbar-brand'>
            <span className='brand-logo'>
              <img src={orgImgPath !== null ? orgImgPath : themeConfig.app.appLogoImage} alt='logo' />
            </span>
            <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
          </NavLink>
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
