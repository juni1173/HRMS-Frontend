import React, { useState } from 'react'
import { Row, Input, Button, Badge, Col, Label } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
import { Save } from 'react-feather'
const UpdateSegmentation = ({ data, CallBack }) => {
    console.warn(data)
    const Api = apiHelper()
    const [segmentationData, setSegmentationData] = useState({
        duration: data.duration ? data.duration : '',
        brainstorming_period : data.brainstorming_period ? data.brainstorming_period : '',
        brainstorming_period_for_evaluator: data.brainstorming_period_for_evaluator ? data.brainstorming_period_for_evaluator : '',
        evaluation_period: data.evaluation_period ? data.evaluation_period : ''
   })
    const duration = [
        {value: 1, label: 1},
        {value: 2, label: 2},
        {value: 3, label: 3},
        {value: 4, label: 4},
        {value: 6, label: 6}
    ]
    const onChangeSegmentationDetailHandler = (InputName, InputType, e) => {
        
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

        setSegmentationData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async (id) => {
        if (segmentationData.duration !== '' && segmentationData.brainstorming_period !== ''
        && segmentationData.brainstorming_period_for_evaluator !== '' && segmentationData.evaluation_period !== '') {
            const formData = new FormData()
            formData['duration'] = segmentationData.duration
            formData['brainstorming_period'] = parseInt(segmentationData.brainstorming_period)
            formData['brainstorming_period_for_evaluator'] = segmentationData.brainstorming_period_for_evaluator
            formData['evaluation_period'] = parseInt(segmentationData.evaluation_period)
            await Api.jsonPatch(`/kpis/set/yearly/segmentation/${id}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                }
            })
           
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
  return (
    <Row>
                <Col md={12}>
                <Row>
                <Col md="6" className="mb-1">
                    <Label className="form-label">
                    Month Duration <Badge color='light-danger'>*</Badge>
                    </Label>
                    <Select
                        isClearable={false}
                        className='react-select'
                        classNamePrefix='select'
                        name="month_duration"
                        options={duration}
                        defaultValue = {duration.find(pre => pre.value === data.duration) ? duration.find(pre => pre.value === data.duration) : ''}
                        onChange={ (e) => { onChangeSegmentationDetailHandler('duration', 'select', e.value) }}
                    />
                </Col>
                <Col md='6' className='mb-1'>
                    <label className='form-label'>
                    Brainstorming Period <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="brainstorming_period"
                        defaultValue={segmentationData.brainstorming_period}
                        onChange={ (e) => { onChangeSegmentationDetailHandler('brainstorming_period', 'input', e) }}
                        placeholder="Brainstorming Period"  />
                </Col>
                <Col md='6' className='mb-1'>
                    <label className='form-label'>
                    Brainstorming Period For Evaluator <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="brainstorming_period_for_evaluator"
                        defaultValue={segmentationData.brainstorming_period_for_evaluator}
                        onChange={ (e) => { onChangeSegmentationDetailHandler('brainstorming_period_for_evaluator', 'input', e) }}
                        placeholder="Brainstorming Period For Evaluator"  />
                </Col>
                <Col md='3' className='mb-1'>
                    <label className='form-label'>
                    Evaluator Period <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="evaluation_period"
                        defaultValue={segmentationData.evaluation_period}
                        onChange={ (e) => { onChangeSegmentationDetailHandler('evaluation_period', 'input', e) }}
                        placeholder="Evaluation Period"  />
                </Col>
                    <Col md={3}>
                    <Button color="warning" className="btn-next mt-2" onClick={() => submitForm(data.id)}>
                    <span className="align-middle d-sm-inline-block">
                    Update
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
  )
}

export default UpdateSegmentation