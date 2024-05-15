import React, { Fragment, useEffect, useState } from 'react'
import { GitMerge } from 'react-feather'
import Select from 'react-select'
import { Button, Card, CardBody, Input, Row, Col, CardHeader, Spinner } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [credentials, setCredentials] = useState(false)
    const [credentialsInfo, setCredentialsInfo] = useState([])
    const [connectionData, setConnectionData] = useState({
        email: '',
        password: '',
        medium: ''
    })
    const mediumOptions = [
        {label: 'Zoho', value: 'zoho'},
        {label: 'Gmail', value: 'gmail'}
    ]
    const getCredentials = async () => {
         
        await Api.get(`/integrations/add/mail/credentials/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    const data = result.data
                    if (data.length > 0) {
                        setCredentialsInfo(data)
                        setCredentials(true)
                    } else {
                        setCredentialsInfo([])
                        setCredentials(false)
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not Found!')
            }
            
        })
    }
    const onChangeHandle = (e, type) => {
        if (e && type) {
            setConnectionData(prevState => ({
                ...prevState,
                [type] : e
                }))
        }
    }
    const handleSubmit = async () => {
        if (connectionData.email !== '' && connectionData.password !== ''
        && connectionData.medium !== '') {
            const formData = new FormData()
            formData['email'] = connectionData.email
            formData['password'] = connectionData.password
            formData['medium'] = connectionData.medium
            await Api.jsonPost(`/integrations/add/mail/credentials/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        setCredentialsInfo(data)
                        setCredentials(true)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not Found!')
                }
            })
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
    useEffect(() => {
        getCredentials()
    }, [setCredentials, setCredentialsInfo])
  return (
    <Fragment>
        <Card>
            <CardBody>
                {!credentials ? (
                    <>
                        <h3>Email Connection Form</h3>
                        <Row>
                        <Col md='3'>
                                <Input
                                type='email'
                                name='email'
                                onChange={(e) => onChangeHandle(e.target.value, 'email')}
                                required
                                />
                        </Col>
                        <Col md='3'>
                            <Input
                                type='password'
                                name='password'
                                onChange={(e) => onChangeHandle(e.target.value, 'password')}
                                required
                            />
                        </Col>
                        <Col md='3'>
                            <Select
                                name='medium'
                                options={mediumOptions}
                                onChange={(e) => onChangeHandle(e.value, 'medium')}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                                required
                            />
                        </Col>
                        <Col md='3'>
                            <Button className='btn btn-primary btn-md' onClick={handleSubmit}><GitMerge color='white' size={16} /> Connect</Button>
                        </Col>
                        </Row>
                    </>
                ) : (
                    !loading ? (
                        <>
                    <Card>
                        <CardHeader>
                            <p>Successfully connected to <b>{credentialsInfo[0].email ? credentialsInfo[0].email : 'N/A'}</b> with <b>{credentialsInfo[0].medium ? credentialsInfo[0].medium : 'N/A'}</b>...</p>
                        </CardHeader>
                        <CardBody>
                            <a href=''>Click here to visit your email panel...</a>
                        </CardBody>
                    </Card>
                    </>
                    ) : <div className='text-center'><Spinner color='primary' size='sm'/> Fetching info...</div>
                    
                )}
               
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index