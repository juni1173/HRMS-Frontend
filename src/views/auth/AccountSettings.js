import { Fragment, useState } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Card, Badge, CardBody, CardHeader  } from "reactstrap" 
import { Save } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
const ChangePassword = () => {
    const Api = apiHelper() 
    const history = useHistory()
    const dispatch = useDispatch()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const img = Api.user.profile_image ? `${process.env.REACT_APP_BACKEND_URL}${Api.user.profile_image}` : defaultAvatar
    const [avatar, setAvatar] = useState(img)
    const [isUppercaseValid, setIsUppercaseValid] = useState(false)
  const [isSpecialCharValid, setIsSpecialCharValid] = useState(false)
  const [isCombinedValid, setIsCombinedValid] = useState(false)
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword : ''
   })
   const [confirmPasswordMatch, setConfirmPasswordMatch] = useState({
        msg: '',
        type: ''
   })
   const UpdateProfileImg = path => {
    if (path) {
        const user = JSON.parse(localStorage.getItem('user'))
        const userToUpdate = user
        userToUpdate.profile_image = path
        localStorage.setItem('user', JSON.stringify(user))
        window.location.reload()
    }
    return false
   }
   const onChangeImg = e => {
    
    const formData = new FormData()
    formData.append('profile_image', e.target.files[0])
    Api.jsonPatch(`/hrms_user/profile/image/update/`, formData, false).then(result => {
        if (result) {
            if (result.status === 200) {
                console.warn(result)
                const reader = new FileReader(),
                files = e.target.files
                reader.onload = function () {
                setAvatar(reader.result)
                }
                reader.readAsDataURL(files[0])
                UpdateProfileImg(result.data.profile_image)
            } else {
                Api.Toast('error', result.message)
            }
        }
    })
  }
//   const handleImgReset = () => {
//     setAvatar(defaultAvatar)
//   }
//    const [gym_receipt, setGym_Receipt] = useState(null)
    const onChangePasswordDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
              
              const formatDate = Api.formatDate(e)
            InputValue = formatDate
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

         setPasswordData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
        if (InputName === 'password') {
            const uppercasePattern = /[A-Z]/
            const isValidUppercase = uppercasePattern.test(InputValue)
            setIsUppercaseValid(isValidUppercase)
        
            // Validate special character
            const specialCharPattern = /[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?]/
            const isValidSpecialChar = specialCharPattern.test(InputValue)
            setIsSpecialCharValid(isValidSpecialChar)
        
            // Validate combined criteria
            const combinedPattern = InputValue.length
            if (combinedPattern >= 8) {
                setIsCombinedValid(true)
            } else {
                setIsCombinedValid(false)
            }
        }
        if (InputName === 'confirmPassword') {
            if (InputValue === '' || !InputValue) {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg: '',
                    type: ''
                }))
            }
            if (passwordData.password !== InputValue) {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg : 'Password does not match',
                    type : 'light-danger'
                    }))
            } else {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg : 'Password match successfully',
                    type : 'light-success'
                    }))
            }
        }
        if (InputName === 'password' && passwordData.confirmPassword !== '') {
            if (InputValue === '' || !InputValue) {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg: '',
                    type: ''
                }))
            }
            if (InputValue !== passwordData.confirmPassword) {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg : 'Password does not match',
                    type : 'light-danger'
                    }))
            } else {
                setConfirmPasswordMatch(prevState => ({
                    ...prevState,
                    msg : 'Password match successfully',
                    type : 'light-success'
                    }))
            }
        }
    }
    // const imageChange = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //       setGym_Receipt(e.target.files[0]) 
    //     }
    //   } 
    // const remove_gym_receipt = () => {
    //     setGym_Receipt(null) 
    //   } 
   
    const changePasswordAction = () => {
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
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to change password?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                if (passwordData.password) formData['password'] = passwordData.password
                if (passwordData.confirmPassword) formData['password2'] = passwordData.confirmPassword
                setLoading(true)
                Api.jsonPost(`/hrms_user/change/password/`, formData)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Password Changed!',
                            text: 'you will be redirected to login page!',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                dispatch(handleLogout())
                                history.push('/login')
                            }
                        }) 
                    } else {

                            setPasswordData(prevState => ({
                                ...prevState,
                                password: '',
                                confirmPassword: ''
                            }))
                            
                            setConfirmPasswordMatch(prevState => ({
                                ...prevState,
                                msg: '',
                                type: ''
                            }))
                        MySwal.fire({
                            icon: 'error',
                            title: 'Password can not be changed!',
                            text: deleteResult.message ? deleteResult.message : 'Password is not changed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            } 
        })
    }
  return (
    <Fragment>
        <Row>
                <Col md={4} className="border-right">
                    <Card>
                        <CardBody>
                            <div className='content-header' >
                                <h5 className='mb-2'>Profile Picture</h5>
                            </div>
                            <div className='d-flex align-items-end mt-75 ms-1'>
                                <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='100' width='100' />
                                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                                    Upload
                                    <Input type='file' onChange={onChangeImg} hidden accept='image/*' />
                                </Button>
                                {/* <Button className='mb-75' color='secondary' size='sm' outline onClick={handleImgReset}>
                                    Reset
                                </Button> */}
                            </div>
                            <div>
                                <p className='mt-2 mb-0'>Allowed JPG, GIF or PNG<br/> Max size of 800kB</p>
                            </div>
                        </CardBody>
                    </Card>
                    
                </Col>
                <Col md={8}>
                    <Card>
                        <CardBody>
                        <div className='content-header' >
                            <h5 className='mb-2'>Change Password</h5>
                        </div>
        
                    {!loading ? (
                        <>
                        <Row>
                            <Col md='4' className='mb-1'>
                                <label className='form-label'>
                                Password <Badge color="light-danger">*</Badge> 
                                </label>
                                <Input type="password" 
                                    name="password"
                                    onChange={ (e) => { onChangePasswordDetailHandler('password', 'input', e) }}
                                    placeholder="Password"  />
                                    <br></br>
                                <Badge color={isUppercaseValid ? 'success' : 'danger'} className='mb-1'>1 Capital letter</Badge>
                                <Badge color={isSpecialCharValid ? 'success' : 'danger'} className='mb-1'>1 special character </Badge>
                                <Badge color={isCombinedValid ? 'success' : 'danger'}>at least 8 total characters</Badge>
                                <br></br>
                                <br></br>
                            </Col>
                            <Col md={4}>
                                <label className='form-label'>
                                    Confirm Password <Badge color="light-danger">*</Badge> 
                                    </label>
                                    <Input type="password" 
                                        name="confirmPassword"
                                        onChange={ (e) => { onChangePasswordDetailHandler('confirmPassword', 'input', e) }}
                                        placeholder="Confirm Password"  />
                                        {confirmPasswordMatch.msg !== '' && (
                                            <Badge color={confirmPasswordMatch.type}>{confirmPasswordMatch.msg}</Badge>
                                        )}
                            </Col>
                            <Col md={3}>
                                
                            <Button color="primary" className="btn-next mt-2" onClick={changePasswordAction} disabled={confirmPasswordMatch.type !== 'light-success' && true }>
                                <span className="align-middle d-sm-inline-block">
                                Save
                                </span>
                                <Save
                                size={14}
                                className="align-middle ms-sm-25 ms-0"
                                ></Save>
                            </Button>
                            </Col>
                        </Row>
                        </>
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )    
                    }
                        </CardBody>
                    </Card>
                </Col>
            
        </Row>
    </Fragment>
  )
}

export default ChangePassword