import React, { Fragment, useState } from 'react'
import { Row, Input, Button, Spinner, Badge, Col, Label, CardBody, Card } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
import { Save } from 'react-feather'

const RequestCertification = ({ preData, CallBack }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [certificateDetail, setCertificateDetail] = useState({
        title: '',
        duration : '',
        mode_of_course: '',
        relevance: '',
        cost: '',
        course_url: '',
        team_lead: '',
        course_reason: ''
   })
    const onChangeCertificateDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setCertificateDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        
        if (certificateDetail.title !== '' && certificateDetail.duration !== '' && certificateDetail.cost !== ''
        && certificateDetail.course_url !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = certificateDetail.title
            formData['duration'] = certificateDetail.duration
            formData['cost'] = certificateDetail.cost
            formData['course_url'] = certificateDetail.course_url

            if (certificateDetail.mode_of_course) formData['mode_of_course'] = certificateDetail.mode_of_course
            if (certificateDetail.relevance) formData['relevance'] = certificateDetail.relevance
            if (certificateDetail.team_lead) formData['team_lead'] = certificateDetail.team_lead
            if (certificateDetail.course_reason) formData['course_reason'] = certificateDetail.course_reason
                await Api.jsonPost(`/certification/employee/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            Api.Toast('success', result.message)
                            CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    }
                })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
  return (
    <Fragment>
    <div className='content-header' >
        <h3 className='text-white'>Request New Certification</h3>
        </div>
    {!loading ? (
    <>
    <Card>
        <CardBody>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md='4' className='mb-1'>
                            <label className='form-label'>
                            Title <Badge color='light-danger'>*</Badge>
                            </label>
                            <Input type="text" 
                                name="title"
                                onChange={ (e) => { onChangeCertificateDetailHandler('title', 'input', e) }}
                                placeholder="Title!"  />
                        </Col>
                        <Col md='4' className='mb-1'>
                            <label className='form-label'>
                            Duration <Badge color='light-danger'>*</Badge>
                            </label>
                            <Input type="text" 
                                name="duration"
                                onChange={ (e) => { onChangeCertificateDetailHandler('duration', 'input', e) }}
                                placeholder="Duration!"  />
                        </Col>
                        <Col md='4' className='mb-1'>
                            <label className='form-label'>
                            Course URL <Badge color='light-danger'>*</Badge>
                            </label>
                            <Input type="text" 
                                name="duration"
                                onChange={ (e) => { onChangeCertificateDetailHandler('course_url', 'input', e) }}
                                placeholder="Course Link!"  />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Team Lead
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="mode_of_course"
                                options={preData.employeesList ? preData.employeesList : ''}
                                onChange={ (e) => { onChangeCertificateDetailHandler('team_lead', 'select', e.value) }}
                            />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Mode Of Course
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="mode_of_course"
                                options={preData.mode_of_course_choice ? preData.mode_of_course_choice : ''}
                                onChange={ (e) => { onChangeCertificateDetailHandler('mode_of_course', 'select', e.value) }}
                            />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Relevance
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="scale_group"
                                options={preData.relevance_choice ? preData.relevance_choice : ''}
                                onChange={ (e) => { onChangeCertificateDetailHandler('relevance', 'select', e.value) }}
                            />
                        </Col>
                        <Col md='4' className='mb-1'>
                            <label className='form-label'>
                            Course Reason   
                            </label>
                            <Input type="textarea" 
                                name="course_reason"
                                onChange={ (e) => { onChangeCertificateDetailHandler('course_reason', 'input', e) }}
                                placeholder="Describe Course Reason!"  />
                        </Col>
                        <Col md={4}>
                        <Button color="primary" className="btn-next mt-4" onClick={submitForm}>
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
                </Col>
            </Row>
        </CardBody>
    </Card>
    </>
    ) : (
        <div className="text-center"><Spinner color='white'/></div>
    )
    }

</Fragment>
  )
}

export default RequestCertification