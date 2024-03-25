import { Fragment, useEffect, useState } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge, UncontrolledTooltip, Card, CardBody  } from "reactstrap" 
import { Save, XCircle, HelpCircle, FileText } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import EmployeeHelper from '../../Helpers/EmployeeHelper'
const Compensatory = () => {
    const Api = apiHelper()
    const employeeHelper = EmployeeHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    // const [yearvalue, setYearValue] = useState(null)
    // const yearValueRef = useRef(null)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [showform, setshowform] = useState(false)
    const [employees, setEmployeeDropdown] = useState([])
    const [reimbursementData, setReimbursementData] = useState({
        jira_ticket: '',
        date : new Date(),
        reason: '',
        team_lead: ''
   })
   const getEmployeeData = async () => {
    await employeeHelper.fetchEmployeeDropdown().then(result => {
      setEmployeeDropdown(result)
     })
  }
  useEffect(() => {
    getEmployeeData()
    return false
  }, [setEmployeeDropdown])
    const onChangeReimbursementDetailHandler = (InputName, InputType, e) => {
        
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

        setReimbursementData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
        console.log(reimbursementData)

    }
      const compensatorydata = async () => {
        setLoading(true)
        const response = await Api.get('/reimbursements/request/compensatory/leaves/')
        if (response.status === 200) {
            setData(response.data)
            setLoading(false)
        } else {
            setLoading(false)
            return Api.Toast('error', 'Pre server data not found')
        }
        // setTimeout(() => {
        //     setLoading(false)
        // }, 1000)
    }
    const CallBack = () => {
      compensatorydata()
    }
    const submitForm = async () => {
        setIsButtonDisabled(true)
        if (reimbursementData.team_lead !== '' && reimbursementData.date !== '') {
            const formData = new FormData()
            formData['team_lead'] = reimbursementData.team_lead.value
            formData['date'] = reimbursementData.date
            formData['jira_ticket'] = reimbursementData.jira_ticket
            formData['reason'] = reimbursementData.reason
            await Api.jsonPost(`/reimbursements/request/compensatory/leaves/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        Api.Toast('success', result.message)
                        // setGym_Receipt(null) 
                        CallBack()
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    } else {
                        Api.Toast('error', result.message)
                    }
                   setIsButtonDisabled(false) 
                }
            })
        } else {
            setIsButtonDisabled(false)
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Claim!",
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
                Api.deleteData(`/reimbursements/remove/compensatory/leaves/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Claim Deleted!',
                            text: 'Claim is deleted.',
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
                            title: 'Claim can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Claim is not deleted.',
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
compensatorydata()
}, [setData])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Compensatory Leaves</h5>
        </div>
        {!loading ? (
                <>
                  <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Claim Compensatory Leave </Button>
                  {showform ?  <Card>
                  <CardBody> 
                  <h5 className='mb-2'>Claim Compensatory leave</h5>
                <Row>      
            <Col md="6" className="mb-1">
            <Label className='form-label' for='default-picker'>
                Date <Badge color="light-danger">*</Badge>
            </Label>
            <Flatpickr className='form-control'  
            onChange={(date) => onChangeReimbursementDetailHandler('date', 'date', date)} 
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
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Team Lead<Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    type="text"
                    name="evaluator"
                    options={employees}
                    onChange={ (e) => { onChangeReimbursementDetailHandler('team_lead', 'select', e) }}
                    />
            </Col>
            <Col md='12'>
            <Label className="form-label">
                        <p>Jira Ticket</p>
                    </Label>
                    <Input 
                    name='jira_ticket'
                    id='jira_ticket'
                    type='textarea'
                    onChange={(e) => onChangeReimbursementDetailHandler('jira_ticket', 'input', e)}
                    />
            </Col>
            <Col md='12'>
            <Label className="form-label">
                        <p>Reason</p>
                    </Label>
                    <Input 
                    name='reason'
                    id='reason'
                    type='textarea'
                    onChange={(e) => onChangeReimbursementDetailHandler('reason', 'input', e)}
                    />
            </Col>
            <Col md={6}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm} disabled={isButtonDisabled}>
                {!isButtonDisabled ? <> <span className="align-middle d-sm-inline-block">
                  Submit
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save> </> : <>
                 {/* <span className="align-middle d-sm-inline-block">
                  Loading
                </span> */}
                <Spinner type='grow' color='primary' size={14}></Spinner>
                
                </>}
              </Button>
                </Col>
                </Row>
                </CardBody></Card> : null }
                <Card>
                  <CardBody>  
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
                                Team Lead
                                </th>
                                <th scope="col" className="text-nowrap">
                                Team Lead Status
                                </th>
                                <th scope="col" className="text-nowrap">
                                HR Status
                                </th>
                                <th scope="col" className="text-nowrap">
                                Jira Ticket
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
                                        <td>{item.team_lead_name ? item.team_lead_name : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.team_lead_approval ? item.team_lead_approval : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.hr_approval ? item.hr_approval : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.jira_ticket ? item.jira_ticket : <Badge color='light-danger'>N/A</Badge>}</td>
                                        
                                        
                                            <td className='p-1'>
                                            {item.team_lead_approval === 'pending by team lead' && (
                                            <Row>
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
                <div className="text-center">No Compensatory Claim Data Found!</div>
            )
            
            }
            </CardBody>
            </Card>
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

export default Compensatory