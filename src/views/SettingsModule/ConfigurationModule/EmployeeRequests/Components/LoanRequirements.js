import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table } from 'reactstrap'
import { Save, XCircle, Edit2, HelpCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const LoanRequirements = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [types] = useState([])
    // const [purpose_of_loan] = useState([])
    const [time_frequency] = useState([])
    const [loanData, setLoanData] = useState({
        loan_type: '',
        org_amount : '',
        individual_amount:'',
        emp_salary_factor: '',
        time_frequency: '',
        emp_min_service_duration: '',
        min_provident_fund_duration:''
   })
   const [is_provident_fund, setIsChecked] = useState(false)

   const handleCheckboxChange = () => {
     setIsChecked(!is_provident_fund)
   }
    const onChangeLoanRequirementsDetailHandler = (InputName, InputType, e) => {
        
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

        setLoanData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const dropdown = () => {
        if (Object.values(data).length > 0) {
            if (Object.values(data.types).length > 0) {
                types.splice(0, types.length)
                for (let i = 0; i < data['types'].length; i++) {
                        types.push({value:data['types'][i].id, label: data['types'][i].title })
                } 
            }
            // if (Object.values(data['purpose_of_loan']).length > 0) {
            //     purpose_of_loan.splice(0, purpose_of_loan.length)
            //     for (let i = 0; i < data['purpose_of_loan'].length; i++) {
            //         purpose_of_loan.push({value:data['purpose_of_loan'][i].id, label: data['purpose_of_loan'][i].title })
            //     } 
            // }
            if (Object.values(data['time_frequency']).length > 0) {
                time_frequency.splice(0, time_frequency.length)
                for (let i = 0; i < data['time_frequency'].length; i++) {
                    time_frequency.push({value:data['time_frequency'][i].id, label: data['time_frequency'][i].title })
                } 
            }
        }
    }
    // const onChangeLeaveType = value => {
        
    //         const types = data.types
    //         const sc_status = types.find(pre => pre.id === value) ? types.find(pre => pre.id === value).is_staff_classification : false
    //         setIsSC(sc_status)
    //         onChangeLoanRequirementsDetailHandler('leave_types', 'select', value)
        
    // }
    const submitForm = async () => {
        setLoading(true)
        if (loanData.loan_type !== '' && loanData.org_amount !== '' && loanData.individual_amount !== ''
        && loanData.emp_salary_factor !== '' && loanData.time_frequency !== '' && loanData.emp_min_service_duration !== '') {
            const formData = new FormData()
            formData['loan_type'] = loanData.loan_type 
            formData['organization_cap_amount'] = loanData.org_amount 
            formData['emp_salary_factor'] = loanData.emp_salary_factor 
            formData['max_individual_loan_limit'] = parseInt(loanData.individual_amount)
            formData['time_frequency'] = loanData.time_frequency
            formData['emp_min_service_duration'] = parseInt(loanData.emp_min_service_duration)
            formData['is_provident_fund'] = is_provident_fund 
            if (is_provident_fund) formData['min_provident_fund_duration'] = loanData.min_provident_fund_duration
            await Api.jsonPost(`/reimbursements/set/loan/requirements/`, formData).then(result => {
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
            text: "Do you want to delete the Requirement!",
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
                Api.deleteData(`/reimbursements/set/loan/requirements/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Requirement Deleted!',
                            text: 'Requirement is deleted.',
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
                            title: 'Requirement can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Requirement is not deleted.',
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
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Add Loan Requirements</h5>
          {/* <small>Add position.</small> */}
        </div>
                <>
                <Row>
                <Col md="4" className="mb-1">
                <Label className="form-label">
                Loan Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="loan_type"
                    options={types}
                    onChange={ (e) => { onChangeLoanRequirementsDetailHandler('loan_type', 'select', e.value) }}
                />
                </Col>
                <Col md='4' className='mb-1'>
                    <label className='form-label'>
                   Organization Loan Amount <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="amount"
                        onChange={ (e) => { onChangeLoanRequirementsDetailHandler('org_amount', 'input', e) }}
                        placeholder="Organizaion Loan Amount"  />
                </Col>
                <Col md='4' className='mb-1'>
                    <label className='form-label'>
                   Individual Loan Amount <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="amount"
                        onChange={ (e) => { onChangeLoanRequirementsDetailHandler('individual_amount', 'input', e) }}
                        placeholder="Individual Loan Amount"  />
                </Col>
                <Col md='4' className='mb-1'>
                    <label className='form-label'>
                    Salary Factor <Badge><div title='This is Salary factor!'><HelpCircle/></div></Badge> <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="salary_factor"
                        onChange={ (e) => { onChangeLoanRequirementsDetailHandler('emp_salary_factor', 'input', e) }}
                        placeholder="Salary Factor"  />
                </Col>
                <Col md="4" className="mb-1">
                <Label className="form-label">
                Time Frequency <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="time_frequency"
                    options={time_frequency}
                    onChange={ (e) => { onChangeLoanRequirementsDetailHandler('time_frequency', 'select', e.value) }}
                />
                </Col>

                <Col md='4' className='mb-1'>
                    <label className='form-label'>
                    Min Service Required <Badge><div title='Write number of months!'><HelpCircle/></div></Badge> <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="emp_min_service_duration"
                        onChange={ (e) => { onChangeLoanRequirementsDetailHandler('emp_min_service_duration', 'input', e) }}
                        placeholder="Employee minimum service required"  />
                </Col>
                <Col md='4' className='mb-1'>
                <div className='form-switch form-check-primary float-left'>
                     <Label for='basic-cb-checked' className='form-check-label'>
                        Provident Fund 
                    </Label> <br/>
                    <Input type='switch' id='icon-primary' name='icon-primary' 
                    checked={is_provident_fund}
                    onChange={handleCheckboxChange}
                    />
                   
                </div>
                
                </Col>
                {is_provident_fund && (
                    <Col md='4' className='mb-1'>
                     <label className='form-label'>
                    Min PF Duration <Badge><div title='Write number of months!'><HelpCircle/></div></Badge> <Badge color='light-danger'>*</Badge>
                    </label>
                    <Input type="number" 
                        name="min_provident_fund_duration"
                        onChange={ (e) => { onChangeLoanRequirementsDetailHandler('min_provident_fund_duration', 'input', e) }}
                        placeholder="Employee minimum service required"  />
                    </Col>
                )}
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
            <hr></hr>
            {(data.set_loan_requirements && Object.values(data.set_loan_requirements).length > 0) ? (
                <Row>
                <Col md={12}>
                    <h3 className='m-2'>Loan Requirements List</h3>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Type
                                </th>
                                <th scope="col" className="text-nowrap">
                                Time Frequency
                                </th>
                                <th scope="col" className="text-nowrap">
                                Organization Amount
                                </th>
                                <th scope="col" className="text-nowrap">
                                Individual Amount
                                </th>
                                <th scope="col" className="text-nowrap">
                                Provident Fund
                                </th>
                                <th scope="col" className="text-nowrap">
                                Provident Fund Duration
                                </th>
                                <th scope="col" className="text-nowrap">
                                Minimum Service required
                                </th>
                                <th scope="col" className="text-nowrap">
                                Salary Factor
                                </th>
                                <th scope="col" className="text-nowrap">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {
                                    !loading ? (
                                Object.values(data.set_loan_requirements).map((item, key) => (
                                        <tr key={key}>
                                        <td className="text-nowrap">{item.loan_type_title ? item.loan_type_title : 'N/A' }</td>
                                        <td>{item.time_frequency_title ? item.time_frequency_title : 'N/A' }</td>
                                        <td>{item.organization_cap_amount ? item.organization_cap_amount : 'N/A'}</td>
                                        <td>{item.max_individual_loan_limit ? item.max_individual_loan_limit : 'N/A'}</td>
                                        <td>{item.is_provident_fund ? <Badge color='light-success'>Required</Badge> : <Badge color='light-danger'>Not Required</Badge>}</td>
                                        <td>{item.min_provident_fund_duration ? item.min_provident_fund_duration : 'N/A' }</td>
                                        <td>{item.emp_min_service_duration ? item.emp_min_service_duration : 'N/A'}</td>
                                        <td>{item.emp_salary_factor ? item.emp_salary_factor : 'N/A'}</td>
                                        <td>
                                            <div className="d-flex row">
                                            <div className="col-md-6">
                                                <button
                                                className="border-0"
                                                >
                                                <Edit2 color="orange" />
                                                </button>
                                            </div>
                                            <div className="col-md-6">
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
                                )
                                    ) : (
                                        <tr>
                                            <td colSpan={4}><Spinner /></td>
                                        </tr>
                                    )
                                }
                            
                            </tbody>
                            
                    </Table>
                </Col>
                </Row>
            ) : (
                <div className="text-center">No Loan Requirements Data Found!</div>
            )
        }
                </>
       
        <hr></hr>
           

            </Col>
        </Row>
    </Fragment>
  )
}

export default LoanRequirements