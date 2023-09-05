// ** React Imports
import { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button, Badge } from 'reactstrap'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin()
  const Api = apiHelper()
    const [email, setEmail] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
  const illustration = skin === 'dark' ? 'forgot-password-v2-dark.svg' : 'forgot-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
    const Submit = async () => {
        if (email && email !== '') {
            const formData = new FormData()
            formData['email'] = email
           await Api.jsonPost(`/hrms_user/reset/password/email/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        setSuccessMsg(result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            })
        } else {
            Api.Toast('error', 'Server Error')
        }
    }
  if (!isUserLoggedIn()) {
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
                Enter your email and we'll send you instructions to reset your password
              </CardText>
              <Form className='auth-forgot-password-form mt-2' onSubmit={e => e.preventDefault()}>
                <div className='mb-1'>
                  <Label className='form-label' for='login-email'>
                    Email
                  </Label>
                  <Input type='email' id='login-email' placeholder='john@example.com' autoFocus onChange={e => setEmail(e.target.value)}/>
                </div>
                {successMsg ? <h3 color='success'>{successMsg}</h3> : (
                      <Button color='primary' block onClick={Submit}>
                      Send reset link
                    </Button>
                )}
              
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

export default ForgotPassword
