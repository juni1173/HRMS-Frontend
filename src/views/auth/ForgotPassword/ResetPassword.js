// ** React Imports
import { useState } from 'react'
import { Link, Redirect, useParams, useHistory } from 'react-router-dom'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button, Badge } from 'reactstrap'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import InputPasswordToggle from '@components/input-password-toggle'
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ResetPassword = () => {
  // ** Hooks
  const { skin } = useSkin()
  const Api = apiHelper()
    const [newPassword, setNewPassword] = useState('')
    const [newConfirmPassword, setNewConfirmPassword] = useState('')
    // const [newPassValid, setNewPassValid] = useState(false)
    const [isUppercaseValid, setIsUppercaseValid] = useState(false)
  const [isSpecialCharValid, setIsSpecialCharValid] = useState(false)
  const [isCombinedValid, setIsCombinedValid] = useState(false)
  const history = useHistory()
    const [url_params] = useState(useParams())
  const illustration = skin === 'dark' ? 'forgot-password-v2-dark.svg' : 'forgot-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
    const validatePassword = (value) => {
        // const pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?])(.{8,})$/
        // const isValidPassword = pattern.test(value)
        const uppercasePattern = /[A-Z]/
    const isValidUppercase = uppercasePattern.test(value)
    setIsUppercaseValid(isValidUppercase)

    // Validate special character
    const specialCharPattern = /[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?]/
    const isValidSpecialChar = specialCharPattern.test(value)
    setIsSpecialCharValid(isValidSpecialChar)

    // Validate combined criteria
    const combinedPattern = value.length
    if (combinedPattern >= 8) {
        setIsCombinedValid(true)
    } else {
        setIsCombinedValid(false)
    }
    
        // setNewPassValid(isValidPassword)
        if (isValidUppercase && isValidSpecialChar && combinedPattern >= 8) {
            setNewPassword(value)
        } 
      }
    const Submit = async () => {
        if (!isUppercaseValid) {
            Api.Toast('error', 'Password must contain 1 upper case letter')
            return false
        }
        if (!isSpecialCharValid) {
            Api.Toast('error', 'Password must contain 1 special character')
            return false
        }
        if (!isCombinedValid) {
            Api.Toast('error', 'Password must contain at least 8 character')
            return false
        }
        if (newPassword && newPassword !== '' && newConfirmPassword && newConfirmPassword !== '') {
            const formData = new FormData()
            formData['password'] = newPassword
            formData['password2'] = newConfirmPassword
           await Api.jsonPost(`/hrms_user/reset/password/${url_params.id}/${url_params.token}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        history.push('/')
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            })
        } else {
            Api.Toast('error', 'Required Fields must not be empty')
        }
    }
  if (!isUserLoggedIn() && url_params.id !== '' && url_params.token !== '') {
    return (
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
            <h2 className='brand-text text-primary ms-1'>HRMS</h2>
          </Link>
          <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={source} alt='Login Cover' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='fw-bold mb-1'>
                Forgot Password? 🔒
              </CardTitle>
              <CardText className='mb-2'>
                Enter your new password details...
              </CardText>
              <Form className='auth-forgot-password-form mt-2' onSubmit={e => e.preventDefault()}>
                <div className='mb-1'>
                  <Label className='form-label' for='login-email'>
                    New Password
                  </Label>
                  <br></br>
                    <><Badge color={isUppercaseValid ? 'success' : 'danger'}>1 Capital letter</Badge><br></br><Badge color={isSpecialCharValid ? 'success' : 'danger'}>1 special character </Badge><br></br> <Badge color={isCombinedValid ? 'success' : 'danger'}>at least 8 total characters</Badge></>
                <br></br>
                <br></br>
                  <InputPasswordToggle className='input-group-merge' autoFocus onChange={e => validatePassword(e.target.value)}/>
                </div>
                <div className='mb-1'>
                  <Label className='form-label' for='login-email'>
                    Confirm New Password
                  </Label>
                  <InputPasswordToggle className='input-group-merge' onChange={e => setNewConfirmPassword(e.target.value)}/>
                </div>
                <Button color='primary' block onClick={Submit}>
                  Reset Password
                </Button>
              </Form>
              <p className='text-center mt-2'>
                <Link to='/login'>
                  <ChevronLeft className='rotate-rtl me-25' size={14} />
                  <span className='align-middle'>Back to login</span>
                </Link>
              </p>
            </Col>
          </Col>
        </Row>
      </div>
    )
  } else {
    return <Redirect to='/' />
  }
}

export default ResetPassword
