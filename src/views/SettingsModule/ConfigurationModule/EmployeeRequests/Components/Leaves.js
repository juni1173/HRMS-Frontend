import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table } from 'reactstrap'
import { Save, XCircle, Edit2 } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
const Leaves = ({ staffdropdown, data, CallBack }) => {
    console.warn(data.duration)
    const Api = apiHelper()
    const [leave_types] = useState([])
    const [is_sc, setIsSC] = useState(false)
    const [leaveData, setLeaveData] = useState({
        leave_types: '',
        allowed_leaves : '',
        staff_classification: ''
   })
    const onChangeLeavesDetailHandler = (InputName, InputType, e) => {
        
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

        setLeaveData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const leave_types_dropdown = () => {
        if (Object.values(data).length > 0) {
            leave_types.splice(0, leave_types.length)
            for (let i = 0; i < data['types'].length; i++) {
                    leave_types.push({value:data['types'][i].id, label: data['types'][i].title })
            } 
    }
    }
    const onChangeLeaveType = value => {
        
            const types = data.types
            const sc_status = types.find(pre => pre.id === value) ? types.find(pre => pre.id === value).is_staff_classification : false
            setIsSC(sc_status)
            onChangeLeavesDetailHandler('leave_types', 'select', value)
        
    }
    const submitForm = async () => {
        if (leaveData.allowed_leaves !== '' && leaveData.leave_types !== '') {
            const formData = new FormData()
            formData['leave_types'] = leaveData.leave_types 
            formData['allowed_leaves'] = leaveData.allowed_leaves
            if (leaveData.staff_classification !== '') formData['staff_classification'] = leaveData.staff_classification
            await Api.jsonPost(`/reimbursements/set/leave/duration/limit/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                }
            })
        } else {
            Api.Toast('error', 'Please fill required fields!')
        }
        CallBack()
    }
    useEffect(() => {
        leave_types_dropdown()
    }, [data])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Add Leaves limit</h5>
          {/* <small>Add position.</small> */}
        </div>
        <Col md="6" className="mb-1">
                <Label className="form-label">
                Leave Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="leave_types"
                    options={leave_types}
                    onChange={ (e) => { onChangeLeaveType(e.value) }}
                />
        </Col>
        {Object.values(staffdropdown).length > 0 ?  (
            // !loading ? (
                <>
                <Row>
            {is_sc && (
                <Col md="4" className="mb-1">
                <Label className="form-label">
                Staff Classification
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="staff_classification"
                    options={staffdropdown}
                    onChange={ (e) => { onChangeLeavesDetailHandler('staff_classification', 'select', e.value) }}
                />
                </Col>
                )} 
                <Col md='4' className='mb-1'>
                    <label className='form-label'>
                    Allowed Leaves <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="allowed_leaves"
                        onChange={ (e) => { onChangeLeavesDetailHandler('allowed_leaves', 'input', e) }}
                        placeholder="Allowed Leaves"  />
                </Col>
                <Col md={4}>
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
            {Object.values(data.duration).length > 0 ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Staff Classification
                                </th>
                                <th scope="col" className="text-nowrap">
                                Allowed Leaves
                                </th>
                                <th scope="col" className="text-nowrap">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data.duration).map((item, key) => (
                                        <tr key={key}>
                                        <td>{item.staff_classification_title}</td>
                                        <td>{item.allowed_leaves}</td>
                                        <td>
                                            <div className="d-flex row">
                                            <div className="col">
                                                <button
                                                className="border-0"
                                                >
                                                <Edit2 color="orange" />
                                                </button>
                                            </div>
                                            <div className="col">
                                                <button
                                                className="border-0"
                                                // onClick={() => removeAction(item.id)}
                                                >
                                                <XCircle color="red" />
                                                </button>
                                            </div>
                                            </div>
                                        </td>
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
                </Row>
            ) : (
                <div className="text-center">No Leave Limits Data Found!</div>
            )
        }
                </>
            // ) : (
            //     <div className="text-center"><Spinner /></div>
            // )
            
        ) : (
          <div className="text-center">No Staff Classification Found!</div>
        )}
        <hr></hr>
           

            </Col>
        </Row>
    </Fragment>
  )
}

export default Leaves