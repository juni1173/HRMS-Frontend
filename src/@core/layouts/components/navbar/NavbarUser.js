// ** React Imports
import { Fragment } from 'react'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import { useHistory } from 'react-router-dom'

// ** Third Party Components
import { Sun, Moon, Home, Archive, Grid, Video, Mail, Settings } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'
import themeConfig from '@configs/themeConfig'
import Building from '../../../../assets/images/illustration/building.svg'
const NavbarUser = props => {
  const history = useHistory()
  // ** Props
  const { skin, setSkin } = props
  // const [orgImgPath, setOrgImgPath] = useState(null)

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }
  // const checkImage = () => {
  //   const imageUrl = process.env.REACT_APP_PUBLIC_URL + JSON.parse(localStorage.getItem('organization')).logo
  //   const img = new Image()
  //     img.src = imageUrl
  //     if (img.complete) {
  //     setOrgImgPath(imageUrl)
  //     } else {
  //       setOrgImgPath(null)
  //     }
  //   }
//     useEffect(() => {
// if (localStorage.getItem('organization')) {
//   checkImage()
// }
//     }, [])

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
       {/* <div className='col-lg-6 col-md-6 col-sm-6 d-flex '> */}
              {/* <img width={50} height={50} src={orgImgPath !== null ? orgImgPath : themeConfig.app.appLogoImage} alt='logo' /> */}
        {/* </div> */}
        <div className='nav navbar-nav align-items-center ms-auto'>
        
  {/* <Building className='mr-2'/> */}
  <img 
  // src={JSON.parse(localStorage.getItem('userData')).org.logo} 
  src={Building}
  alt="Organization" 
  className='mr-2' 
  // style={{ width: '100px', height: '40px' }} 
/>
  <h6 className='mr-2 my-0'>{(JSON.parse(localStorage.getItem('organization'))) ? JSON.parse(localStorage.getItem('organization')).name : themeConfig.app.appName}</h6>
  <Grid className="mx-2" onClick={() => history.push('/apps')} />
  {/* <Video className="mx-2" onClick={() => history.push('/zoom')} />
  <Mail className="mx-2" onClick={() => history.push('/email/panel')} /> */}
  {JSON.parse(localStorage.getItem('userData')).user_role === 'employee' ? null : <Settings className="mx-2" onClick={() => history.push('/configurations')} /> }
  <UserDropdown />
</div>
    </Fragment>
  )
}
export default NavbarUser
