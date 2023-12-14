import { Fragment, useState, useEffect } from "react"
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../../../Helpers/ApiHelper"
import EmployeeHelper from "../../../../../Helpers/EmployeeHelper"
const UpdatePlan = ({ data, CallBack }) => {
    console.warn(data)
  const Api = apiHelper()
  const employeeHelper = EmployeeHelper()
    const [loading, setLoading] = useState(false)
    const [employees, setEmployeeDropdown] = useState([])
    const [plan, setPlan] = useState({
         title : data.title ? data.title : '',
         evaluator: data.evaluator ? data.evaluator : '',
         duration : data.duration ? data.duration : '',
         description : data.description ? data.description : '',
         mode_of_training: data.mode_of_training ? data.mode_of_training : '',
         cost: data.cost ? data.cost : ''
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
        if (plan.title !== '' && plan.duration !== '' && plan.mode_of_training !== '' && data.evaluator !== '') {
            setLoading(true)
            const formData = new FormData()
            if (plan.mode_of_training.value === 1 && plan.cost === '') {
                return Api.Toast('error', 'Paid cost is required!') 
              } else {
                formData['cost'] = plan.cost
              }
            if (plan.mode_of_training.value !== 1 || plan.mode_of_training !== 1) {
                formData['cost'] = ''
            }
            formData['title'] = plan.title
            formData['duration'] = plan.duration
            formData['mode_of_training'] = plan.mode_of_training.value
            if (plan.description !== '') formData['description'] = plan.description
        await Api.jsonPatch(`/training/${data.id}/`, formData)
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
            }, 500)
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        
    }
    const getEmployeeData = async () => {
        setLoading(true)
        await employeeHelper.fetchEmployeeDropdown().then(result => {
          setEmployeeDropdown(result)
         })
         setTimeout(() => {
            setLoading(false)
        }, 500)
      }
      useEffect(() => {
        getEmployeeData()
        return false
      }, [setEmployeeDropdown])
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
                    defaultValue={plan.title}
                    
                    />
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Evaluator<Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    type="text"
                    name="evaluator"
                    options={employees}
                    defaultValue={employees.length > 0 ? (employees.find(pre => pre.value === data.evaluator) ? employees.find(pre => pre.value === data.evaluator) : '') : ''}
                    onChange={ (e) => { onChangeHandler('evaluator', 'select', e) }}
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
                    defaultValue={mode_of_training_choices.find(pre => pre.value === plan.mode_of_training) ? mode_of_training_choices.find(pre => pre.value === plan.mode_of_training) : ''}
                    onChange={ (e) => { onChangeHandler('mode_of_training', 'select', e) }}
                    />
            </Col>
            {(plan.mode_of_training.value === 1 || plan.mode_of_training === 1) && (
              <Col md="6" className="mb-1">
                  <Label className="form-label">
                    Cost<Badge color='light-danger'>*</Badge>
                  </Label>
                  <Input
                      type="number"
                      name="cost"
                      defaultValue={data.cost ? data.cost : ''}
                      onChange={ (e) => { onChangeHandler('cost', 'input', e) }}
                      placeholder="Cost"
                  />
              </Col>
            )}
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Duration <Badge color='light-danger'>*</Badge>
                </Label>
                <Input
                    type="number"
                    name="duration"
                    onChange={ (e) => { onChangeHandler('duration', 'input', e) }}
                    placeholder="Duration"
                    defaultValue={plan.duration}
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
                    defaultValue={plan.description}
                    />
                
            </Col>
            <Col md={(plan.mode_of_training || plan.mode_of_training.value) === 1 ? '12' : '6'} className="mt-2">
               <button className="btn-next float-right btn btn-warning" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
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

export default UpdatePlan