import { Fragment, useState } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, Save, XCircle } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const Medical = ({ data, CallBack }) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [medicalData, setMedicalData] = useState({
        amount: '',
        date : new Date()
   })
   const [medical_receipt, setMedical_Receipt] = useState(null)
    const onChangeMedicalDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
              
              const formatDate = Api.formatDate(e)
              console.warn(formatDate)
            InputValue = formatDate
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setMedicalData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setMedical_Receipt(e.target.files[0]) 
        }
      } 
    const remove_medical_receipt = () => {
        setMedical_Receipt(null) 
      } 
    const submitForm = async () => {
        setLoading(true)
        if (medicalData.amount !== '' && medicalData.date !== '') {
            const formData = new FormData()
            formData.append('amount', medicalData.amount)
            formData.append('date', medicalData.date)
            if (medical_receipt !== null) formData.append('medical_receipt', medical_receipt)
            await Api.jsonPost(`/reimbursements/employees/medical/allowance/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        setMedical_Receipt(null)
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
            text: "Do you want to delete the Medical claim!",
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
                Api.deleteData(`/reimbursements/employees/medical/allowance/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Medical Claim Deleted!',
                            text: 'Medical Claim is deleted.',
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
                            title: 'Medical Claim can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Medical Claim is not deleted.',
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
          <h5 className='mb-2'>Claim Medical Allowance</h5>
          {/* <small>Add position.</small> */}
        </div>
        
        {!loading ? (
                <>
                <Row>
                    
            <Col md="3" className="mb-1">
            <Label className='form-label' for='default-picker'>
                Date <Badge color="light-danger">*</Badge>
            </Label>
            <Flatpickr className='form-control'  
            onChange={(date) => onChangeMedicalDetailHandler('date', 'date', date)} 
            id='default-picker' 
            placeholder='Date'
            options={{
                disable: [
                function(date) {
                    const d = new Date()
                    return (date > d) 
                } 
                ]
              } }
            />
            </Col>
              <Col md='3' className='mb-1'>
                <label className='form-label'>
                  Amount <Badge color="light-danger">*</Badge> 
                </label>
                <Input type="number" 
                    name="amount"
                    onChange={ (e) => { onChangeMedicalDetailHandler('amount', 'input', e) }}
                    placeholder="Amount"  />
              </Col>
              <Col md={3}>
              {medical_receipt ? (
              <div className="float-right">
                <img
                  src={URL.createObjectURL(medical_receipt)}
                  alt="Thumb"
                  width="50"
                />
                <button className="btn" onClick={remove_medical_receipt}>
                  <XCircle />
                </button>
              </div>
            ) : (
              <div>
                <Label className="form-label">Receipt (JPG/PNG)</Label>
                <Input
                      type="file"
                      id="medical_receipt"
                      name="medical_receipt"
                      accept="image/*"
                      onChange={imageChange}
                    />
              </div>
            )}
              </Col>
                <Col md={3}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm}>
                <span className="align-middle d-sm-inline-block">
                  Submit
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
                </Col>
                </Row>
            {(data && Object.values(data).length > 0) ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Amount Claimed
                                </th>
                                <th scope="col" className="text-nowrap">
                                Remaining / Limit (Yearly)
                                </th>
                                <th scope="col" className="text-nowrap">
                                Receipt
                                </th>
                                <th scope="col" className="text-nowrap">
                                Status
                                </th>
                                <th scope="col" className="text-nowrap">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.amount ? item.amount : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.employee_remaining_allowance ? item.employee_remaining_allowance : <Badge color='light-danger'>N/A</Badge>} / {item.medical_yearly_limit ? item.medical_yearly_limit : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.medical_receipt ? <a target='_blank' href={`${process.env.REACT_APP_BACKEND_URL}${item.medical_receipt}`}> <img src={`${process.env.REACT_APP_BACKEND_URL}${item.medical_receipt}`} width={20} height={20}/></a> : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td><Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge></td>
                                        <td>
                                            <Row className='text-center'>
                                            <Col className='col-6 border-right'>
                                                <button
                                                className="border-0 no-background"
                                                >
                                                <Edit2 color="orange" />
                                                </button>
                                            </Col>
                                            <Col className='col-6'>
                                                <button
                                                className="border-0 no-background"
                                                onClick={() => removeAction(item.id)}
                                                >
                                                <XCircle color="red" />
                                                </button>
                                            </Col>
                                            </Row>
                                        </td>
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
            </Row>
                ) : (
                    <div className="text-center">No Medical Allowance Data Found!</div>
                )
                
                }
                    </>
                ) : (
                    <div className="text-center"><Spinner /></div>
                )  
            }
        <hr></hr>
            </Col>
        </Row>
    </Fragment>
  )
}

export default Medical