import React, { Fragment, useState,  useEffect } from 'react'
import { Row, Input, Button, Spinner, Badge, Col, Label } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
import SegmentationTable from './SegmentationTable'
import { Save } from 'react-feather'
const KpiSegmentationForm = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [segmentationData, setSegmentationData] = useState({
        duration: '',
        brainstorming_period : '',
        brainstorming_period_for_evaluator: '',
        evaluation_period: ''
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
    const preDataApi = async () => {
        setLoading(true)
        const response = await Api.get('/kpis/set/yearly/segmentation/')
        
        if (response.status === 200) {
            setData(response.data)
          
        } else {
            return Api.Toast('error', 'Pre server data not found')
        }
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const submitForm = async () => {
        if (segmentationData.duration !== '' && segmentationData.brainstorming_period !== ''
        && segmentationData.brainstorming_period_for_evaluator !== '' && segmentationData.evaluation_period !== '') {
            const formData = new FormData()
            formData['duration'] = segmentationData.duration
            formData['brainstorming_period'] = segmentationData.brainstorming_period
            formData['brainstorming_period_for_evaluator'] = segmentationData.brainstorming_period_for_evaluator
            formData['evaluation_period'] = segmentationData.evaluation_period
            await Api.jsonPost(`/kpis/set/yearly/segmentation/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        setLoading(true)
                        preDataApi()
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    } else {
                        Api.Toast('error', result.message)
                    }
                }
            })
           
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
   
    useEffect(() => {
        preDataApi()
        }, [setData])
        
  return (
    <Fragment>
        <div className='content-header' >
            <h5 className='mb-2'>Kpi Yearly Segmentations</h5>
            </div>
        {!loading ? (
        Object.values(data).length > 0 ? (
        <>
            <Row>
                <SegmentationTable kpidata={data ? data : null} CallBack={preDataApi}/>
            </Row>
        </>
        ) : (
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
                        onChange={ (e) => { onChangeSegmentationDetailHandler('duration', 'select', e.value) }}
                    />
                </Col>
                <Col md='6' className='mb-1'>
                    <label className='form-label'>
                    Brainstorming Period <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="brainstorming_period"
                        onChange={ (e) => { onChangeSegmentationDetailHandler('brainstorming_period', 'input', e) }}
                        placeholder="Brainstorming Period"  />
                </Col>
                <Col md='6' className='mb-1'>
                    <label className='form-label'>
                    Brainstorming Period For Evaluator <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="brainstorming_period_for_evaluator"
                        onChange={ (e) => { onChangeSegmentationDetailHandler('brainstorming_period_for_evaluator', 'input', e) }}
                        placeholder="Brainstorming Period For Evaluator"  />
                </Col>
                <Col md='3' className='mb-1'>
                    <label className='form-label'>
                    Evaluator Period <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="evaluation_period"
                        onChange={ (e) => { onChangeSegmentationDetailHandler('evaluation_period', 'input', e) }}
                        placeholder="Evaluation Period"  />
                </Col>
                    <Col md={3}>
                    <Button color="primary" className="btn-next mt-2" onClick={submitForm}>
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
          )
        ) : (
            <div className="text-center"><Spinner /></div>
        )
        }

    </Fragment>
    
  )
}

export default KpiSegmentationForm