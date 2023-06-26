import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table } from 'reactstrap'
import { Save, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const Loan = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [loan_types] = useState([])
    const [purpose_of_loan] = useState([])
    const [loanData, setLoanData] = useState({
        loan_type: '',
        amount : '',
        number_of_loan_installment: '',
        loan_start_date: '',
        purpose_of_loan: ''
   })
   const Installments_choices = [
    {value: 4, label: '4'},
    {value: 6, label: '6'},
    {value: 8, label: '8'},
    {value: 12, label: '12'}
   ]
    const onChangeLoansDetailHandler = (InputName, InputType, e) => {
        
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

        setLoanData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const dropdown = () => {
        if (Object.values(data).length > 0) {
            if (Object.values(data.types).length > 0) {
                loan_types.splice(0, loan_types.length)
                for (let i = 0; i < data['types'].length; i++) {
                        loan_types.push({value:data['types'][i].id, label: data['types'][i].title })
                } 
            }
            if (Object.values(data['purpose_of_loan']).length > 0) {
                purpose_of_loan.splice(0, purpose_of_loan.length)
                for (let i = 0; i < data['purpose_of_loan'].length; i++) {
                    purpose_of_loan.push({value:data['purpose_of_loan'][i].id, label: data['purpose_of_loan'][i].title })
                } 
            }
        }
    }
  
    const submitForm = async () => {
        setLoading(true)
        if (loanData.loan_type !== '' && loanData.amount !== '' && loanData.loan_start_date !== '' && loanData.number_of_loan_installment !== ''
        && loanData.purpose_of_loan !== '') {
            const formData = new FormData()
            formData['loan_type'] =  loanData.loan_type
            formData['amount'] =  parseInt(loanData.amount)
            formData['loan_start_date'] =  loanData.loan_start_date
            formData['number_of_loan_installment'] =  parseInt(loanData.number_of_loan_installment)
            formData['purpose_of_loan'] =  loanData.purpose_of_loan
            await Api.jsonPost(`/reimbursements/employees/loans/`, formData).then(result => {
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
            Api.Toast('error', 'Please fill required fields!')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Loan Request!",
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
                Api.deleteData(`/reimbursements/employees/loans/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Loan Request Deleted!',
                            text: 'Loan Request is deleted.',
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
                            title: 'Loan Request can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Loan Request is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
  
    useEffect(() => {
        dropdown()
    }, [data])
  return (
    <Fragment>
        <Row>
         <div className='content-header' >
          <h5 className='mb-2'>Loan Requests</h5>
          {/* <small>Add position.</small> */}
        </div>
        {!loading && (
            <>
        <Col md="4" className="mb-1">
                <Label className="form-label">
                Loan Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="loan_types"
                    options={loan_types}
                    onChange={ (e) => onChangeLoansDetailHandler('loan_type', 'select', e.value) }
                />
        </Col>
        <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Purpose Of Loan <Badge color="light-danger">*</Badge> 
                </label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="purpose_of_loan"
                    options={purpose_of_loan}
                    onChange={ (e) => onChangeLoansDetailHandler('purpose_of_loan', 'select', e.value) }
                />
        </Col>
        <Col md="4" className="mb-1">
            <Label className='form-label' for='default-picker'>
               Loan Start Date <Badge color="light-danger">*</Badge>
            </Label>
            <Flatpickr className='form-control'  
            onChange={(date) => onChangeLoansDetailHandler('loan_start_date', 'date', date)} 
            id='default-picker' 
            placeholder='Loan Start Date'
            />
        </Col>
        <Col md="4" className="mb-1">
            <Label className='form-label' for='default-picker'>
               Amount <Badge color="light-danger">*</Badge>
            </Label>
            <Input type="number" 
                    name="amount"
                    min="0"
                    onChange={ (e) => { onChangeLoansDetailHandler('amount', 'input', e) }}
                    placeholder="Amount"  />
        </Col>
        <Col md="4" className="mb-1">
            <Label className='form-label' for='default-picker'>
               Loan Installments <Badge color="light-danger">*</Badge>
            </Label>
            <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="number_of_loan_installment"
                    options={Installments_choices}
                    onChange={ (e) => { onChangeLoansDetailHandler('number_of_loan_installment', 'select', e.value) }}
                />
        </Col>
        <Col md="4">
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
        </>
        )}
        </Row>
        {!loading ? (
                <>
        {(data.employee_loan && Object.values(data.employee_loan).length > 0) ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Amount
                                </th>
                                <th scope="col" className="text-nowrap">
                                Installments
                                </th>
                                <th scope="col" className="text-nowrap">
                                Start Date
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
                                {Object.values(data.employee_loan).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.amount ? item.amount : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.number_of_loan_installment ? item.number_of_loan_installment : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.loan_start_date ? item.loan_start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td><Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge></td>
                                        <td>
                                        {item.status === 'in-progress' && (
                                            <Row className='text-center'>
                                            <Col className='col-12'>
                                                <button
                                                className="border-0 no-background"
                                                onClick={() => removeAction(item.id)}
                                                >
                                                <XCircle color="red" />
                                                </button>
                                            </Col>
                                            </Row>
                                            )}
                                        </td>
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
            </Row>
                ) : (
                    <div className="text-center">No Loan Data Found!</div>
                )
                
                }
                    </>
                ) : (
                    <div className="text-center"><Spinner /></div>
                )  
            }
    </Fragment>
  )
}

export default Loan