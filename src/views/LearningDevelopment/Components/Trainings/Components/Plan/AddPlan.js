import { Fragment, useState } from "react"
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../../../Helpers/ApiHelper"

const AddPlan = ({ CallBack }) => {
  const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [plan, setPlan] = useState({
         title : '',
         duration : '',
         description : '',
         mode_of_training: ''
    })
    const mode_of_training_choices = [
      {value: 1, label: 'Paid'},
      {value: 2, label: 'Free'}
    ]
    const onChangeHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            const dateFormat = Api.formatDate(e)
               
            InputValue = dateFormat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setPlan(prevState => ({
        ...prevState,
        [InputName] : InputValue
        }))
    
    }

    const Submit = async (e) => {
        e.preventDefault()
        if (plan.title !== '' && plan.duration !== '' && plan.mode_of_training !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = plan.title
            formData['duration'] = plan.duration
            formData['mode_of_training'] = plan.mode_of_training.value
            if (plan.description !== '') formData['description'] = plan.description
        await Api.jsonPost(`/training/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        
    }
  return (
    <Fragment>
    {!loading ? (
        <Form >
        <Row>
            <Col md="6" className="mb-1">
                <Label className="form-label">
                Title<Badge color='light-danger'>*</Badge>
                </Label>
                <Input
                    type="text"
                    name="title"
                    onChange={ (e) => { onChangeHandler('title', 'input', e) }}
                    placeholder="Title"
                    
                    />
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Mode of Training<Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    type="text"
                    name="type"
                    options={mode_of_training_choices}
                    onChange={ (e) => { onChangeHandler('mode_of_training', 'select', e) }}
                    />
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Duration
                </Label>
                <Input
                    type="number"
                    name="duration"
                    onChange={ (e) => { onChangeHandler('duration', 'input', e) }}
                    placeholder="Duration"
                    
                    />
                
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Description
                </Label>
                <Input
                    type="text-area"
                    name="description"
                    onChange={ (e) => { onChangeHandler('description', 'input', e) }}
                    placeholder="Description"
                    
                    />
                
            </Col>
        </Row>
        <Row>
            <Col md="12" className="mb-1">
               <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
            </Col>
        </Row>
    </Form>
    ) : (
        <div className="text-center"><Spinner/></div>
    )
    }
     
   
</Fragment>
  )
}

export default AddPlan