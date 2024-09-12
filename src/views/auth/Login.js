// ** React Imports
import { Fragment, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import { useDispatch } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Coffee, Key } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
// import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import apiHelper from '../Helpers/ApiHelper'
// ** Utils
// import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, UncontrolledTooltip, Spinner } from 'reactstrap'
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title fw-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to HRMS. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)
const defaultValues = {
  password: '',
  loginEmail: ''
}

const Login = () => {
  // ** Hooks
  const Api = apiHelper()
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  // const ability = useContext(AbilityContext)
  const formData = new FormData()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({defaultValues})
  const illustration = skin === 'dark' ? 'login-image.png' : 'login-image.png',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = async data => {
    setLoading(true)
    if (Object.values(data).every(field => field.length > 0)) {
      formData['email'] =  data.loginEmail
      formData['password'] = data.password
      await Api.jsonPost(`/hrms_user/login/`, formData)
      .then((result) => {
        if (result) {
          if (result.status === 200) {
            const data = {status:result.status, accessToken: result.token.accessToken, refreshToken: result.token.refreshToken, org: {id: result.org_id, name: result.organization_name, logo: result.organization_logo}, user_id: result.user_id, user_role: result.admin ? 'admin' : 'employee' }
            dispatch(handleLogin(data))
            localStorage.setItem('organization', JSON.stringify(data.org))
            localStorage.setItem('user', JSON.stringify(result.user))
            localStorage.setItem('user_id', data.user_id)
            localStorage.setItem('is_superuser', result.is_privileged)
            if (result.admin) {
              history.push('/admin/dashboard')              
              // history.push('/organizationHome')
              toast.success(
                <ToastContent name={data.fullName || data.username || 'HR Manager'} role={data.role || 'admin'} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
            } else {
              history.push('/employee/dashboard')
              toast.success(
                <ToastContent name={result.user.name || data.username || 'Employee'} role={data.role || 'Employee'} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
            }
            // history.push('/organizationHome')
            
            
          } else {
            history.push('/')
            Api.Toast('error', result.message)
          }
        } else {
          Api.Toast('error', 'Server not responding!')
        }
        // const data = {status:result.status, accessToken: result.token.accessToken, refreshToken: result.token.refreshToken, org_id: result.org_id, user_id: result.user_id }
        // dispatch(handleLogin(data))
        // ability.update(result.data.userData.ability)
        // if (data.status === 200) {
        //   localStorage.setItem('organization', JSON.stringify({id: data.org_id}))
        //   localStorage.setItem('user_id', data.user_id)
        //   history.push('organizationHome')
        //  } else {
        //   history.push('/')
        //   Api.Toast('error', result.message)
        //  }//history.push(getHomeRouteForLoggedInUser(data.role))
          
        })
    } else {
        for (const key in data) {
          if (data[key].length === 0) {
            setError(key, {
              type: 'manual',
              message: 'Please enter valid detail'
            })
          }
        }
      }
      setTimeout(() => {
        setLoading(false)
      }, 500)
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0 p-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>HRMS</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-0' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
               Welcome to HRMS! {/*👋 */}
            </CardTitle>
            <CardText className='mb-2'>Sign in</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              {/* <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div> */}
              {!loading ? (
                <Button type='submit' color='primary' block>
                Sign in
              </Button>
              ) : (
                <div className='text-center'><Spinner type='grow' color='primary'/></div>
              )}
              
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
