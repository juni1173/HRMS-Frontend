import React, { Fragment, useEffect, useState, useRef} from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table, UncontrolledTooltip, CardBody, Card } from 'reactstrap'
import { Save, XCircle, HelpCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const Loan = ({ loandata, yearoptions}) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState()
    const [yearvalue, setYearValue] = useState(null)
    const [showform, setshowform] = useState(false)
    const yearValueRef = useRef(null)
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
            if (formatDate === 'NaN-NaN-NaN') {
                InputValue = ''
            } else {
                InputValue = formatDate
            }
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setLoanData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const dropdown = () => {
        if (Object.values(loandata).length > 0) {
            if (Object.values(loandata.types).length > 0) {
                loan_types.splice(0, loan_types.length)
                for (let i = 0; i < loandata['types'].length; i++) {
                        loan_types.push({value:loandata['types'][i].id, label: loandata['types'][i].title })
                } 
            }
            if (Object.values(loandata['purpose_of_loan']).length > 0) {
                purpose_of_loan.splice(0, purpose_of_loan.length)
                for (let i = 0; i < loandata['purpose_of_loan'].length; i++) {
                    purpose_of_loan.push({value:loandata['purpose_of_loan'][i].id, label: loandata['purpose_of_loan'][i].title })
                } 
            }
        }
    }
    const loan = async () => {
        setLoading(true)
        const formData = new FormData()
        formData['year'] = yearvalue
        const response = await Api.jsonPost('/reimbursements/employee/recode/loan/data/', formData)
        if (response.status === 200) {
            setLoading(false)
            setData(response.data)
        } else {
            setLoading(false)
            return Api.Toast('error', 'Pre server data not found')
        }
        // setTimeout(() => {
        //     setLoading(false)
        // }, 1000)
    }
    const CallBack = () => {
       loan() 
    }
    const submitForm = async () => {
       
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
                        setLoading(true)
                        Api.Toast('success', result.message)
                        CallBack()
                        setLoanData(prevState => ({
                            ...prevState,
                            loan_type: '',
                            amount : '',
                            number_of_loan_installment: '',
                            loan_start_date: '',
                            purpose_of_loan: ''
                       })
                       )
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
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
loan()
}, [setData, yearvalue])
    useEffect(() => {
        dropdown()
    }, [loandata])
  return (
    <Fragment>
         <div className='content-header' >
          <h5 className='mb-2'>Loan Requests</h5>
          {/* <small>Add position.</small> */}
        </div>
        <Row>
        {!loading && (
            <>
            <Col md={12}>
        <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Request Loan </Button>
        {showform ?  <Card>
            <CardBody>
                <h5 className='mb-2'>Add Loan Requests</h5>
                <Row>
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
                    menuPlacement="auto" 
                    menuPosition='fixed'
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
                    menuPlacement="auto" 
                    menuPosition='fixed'
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
        </Row>
                </CardBody></Card> : null}
       </Col>
        </>
        )}
        <Card>
            <CardBody>
                <Col md={6} className="mt-2">
    <Label>Seaarch By Year</Label>
    <Select
      isClearable={true}
      options={yearoptions}
      className='react-select mb-1'
      classNamePrefix='select'
      placeholder="Search By Year"
      value={yearoptions.find(option => option.value === yearvalue)}
      onChange={(selectedOption) => {
        if (selectedOption !== null) {
          setYearValue(selectedOption.value)
          yearValueRef.current = selectedOption.value
        } else {
            setYearValue(null)
            yearValueRef.current = null
          }
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
    />
  </Col>
    
        {!loading ? (
                <>
        {(data && Object.values(data).length > 0) ? (
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
                                {Object.values(data).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.amount ? item.amount : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.number_of_loan_installment ? item.number_of_loan_installment : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.loan_start_date ? item.loan_start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>
                                        <Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge> 
                                        {item.decision_reason && (<> <HelpCircle id={`UnControlledLoan${key}`}/><UncontrolledTooltip  target={`UnControlledLoan${key}`}>{item.decision_reason} </UncontrolledTooltip></>)}
                                        </td>
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
            </CardBody>
            </Card>
            </Row>
        
    </Fragment>
  )
}

export default Loan