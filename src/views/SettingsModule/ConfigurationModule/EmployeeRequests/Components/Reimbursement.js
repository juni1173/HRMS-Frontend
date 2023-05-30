import { Fragment, useState } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, Save, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Reimbursement = ({ staffdropdown, data, CallBack }) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [reimbursementData, setReimbursementData] = useState({
        staff_classification: '',
        monthly_limit : ''
   })
    const onChangeReimbursementDetailHandler = (InputName, InputType, e) => {
        
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

        setReimbursementData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        setLoading(true)
        if (reimbursementData.staff_classification !== '' && reimbursementData.monthly_limit !== '') {
            const formData = new FormData()
            formData['staff_classification'] = reimbursementData.staff_classification
            formData['monthly_limit'] = reimbursementData.monthly_limit 
            await Api.jsonPost(`/reimbursements/set/gym/allowance/limit/`, formData).then(result => {
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
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Reimbursement!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/reimbursements/set/gym/allowance/limit/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Reimbursement Deleted!',
                            text: 'Reimbursement is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                CallBack()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Reimbursement can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Reimbursement is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Add gym allowance monthly limit</h5>
          {/* <small>Add position.</small> */}
        </div>
        
        {Object.values(staffdropdown).length > 0 ?  (
            !loading ? (
                <>
                    <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Staff Classification <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="staff_classification"
                            options={staffdropdown}
                            onChange={ (e) => { onChangeReimbursementDetailHandler('staff_classification', 'select', e.value) }}
                        />
                    </Col>
                    <Col md='4' className='mb-1'>
                        <label className='form-label'>
                        Monthly Limit <Badge color='light-danger'>*</Badge>
                        </label>
                        <Input type="number" 
                            name="monthly_limit"
                            onChange={ (e) => { onChangeReimbursementDetailHandler('monthly_limit', 'input', e) }}
                            placeholder="Monthly Limit"  />
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
                    {Object.values(data).length > 0 ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Staff Classification
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Monthly Limit
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.staff_classification_title}</td>
                                                <td>{item.monthly_limit}</td>
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
                                                        onClick={() => removeAction(item.id)}
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
                            <div className="text-center">No Gym Allowance Data Found!</div>
                        )
                    }
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )
            
        ) : (
          <div className="text-center">No Staff Classification Found!</div>
        )}
        <hr></hr>
            </Col>
        </Row>
    </Fragment>
  )
}

export default Reimbursement