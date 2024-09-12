import { Fragment, useEffect, useState } from 'react'
import { Offcanvas, OffcanvasBody, OffcanvasHeader, Label, Row, Col, Input, Button, Spinner, Table, Badge, UncontrolledTooltip, Card, CardBody  } from "reactstrap" 
import { Save, XCircle, HelpCircle, FileText, Check } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import EmployeeHelper from '../../Helpers/EmployeeHelper'
import JDList from './jd'
const RequisitionRequest = () => {
    const Api = apiHelper()
    const employeeHelper = EmployeeHelper() 
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [showform, setshowform] = useState(false)
    const [replacementdropdown, setReplacementDropdown] = useState([])
    const [positiondropdown, setpositionDropdown] = useState([])
    const [employees, setEmployeeDropdown] = useState([])
    const [selectedJD, setSelectdJD] = useState()
    const [requisitionData, setrequisitionData] = useState({
        position: '',
        supervisor : '',
        desired_start_date: '',
        no_of_individuals: '',
        replacement_for: '',
        duration: '',
        jd_selection: '',
        replacement_of: ''
   })
   const CallBack = (item) => {
    if (item !== undefined && item !== null) {
requisitionData.jd_selection = item.id
setSelectdJD(item)
toggleCanvasEnd()    
}
   }
  
   const getEmployeeData = async () => {
    await employeeHelper.fetchEmployeeDropdown().then(result => {
      setEmployeeDropdown(result)
     })
     await employeeHelper.fetchReplacementFor().then(result => {
        setReplacementDropdown(result)
     })
     await employeeHelper.fetchPositionDropdown().then(result => {
        setpositionDropdown(result)
     })
  }
  useEffect(() => {
    getEmployeeData()
    return false
  }, [setEmployeeDropdown, setReplacementDropdown])
    const onChangeRequsitionDataHandler = (InputName, InputType, e) => {
        
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

        setrequisitionData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
      const fetchrequisitionData = async () => {
        setLoading(true)
        const response = await Api.get('/requisition/view/request/')
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
    // const CallBack = () => {
    //   compensatorydata()
    // }
    const fetchCallBack = () => {
        fetchrequisitionData()
       }
    const submitForm = async () => {
        setIsButtonDisabled(true)
        if (requisitionData.position !== '' && requisitionData.desired_start_date !== '' && requisitionData.supervisor !== '' && requisitionData.no_of_individuals !== '' && requisitionData.jd_selection !== '') {
            const formData = new FormData()
            formData['position'] = requisitionData.position.value
            formData['supervisor'] = requisitionData.supervisor.value
            formData['desired_start_date'] = requisitionData.desired_start_date
            formData['replacement_of'] = requisitionData.replacement_of.value
            formData['replacement_for'] = requisitionData.replacement_for.value
            formData['no_of_individuals'] = parseInt(requisitionData.no_of_individuals)
            if (requisitionData.duration !== null && requisitionData.duration !== '') {
            formData['duration'] = requisitionData.duration
            }
            formData['jd_selection'] = requisitionData.jd_selection
            await Api.jsonPost(`/requisition/request/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        Api.Toast('success', result.message)
                        // setGym_Receipt(null) 
                        fetchCallBack()
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
            text: "Do you want to delete the request!",
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
                Api.deleteData(`/requisition/delete/request/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Request Deleted!',
                            text: 'Request is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                fetchCallBack()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Request can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Request is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
        setData([])
    }
    const sendtohr = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to send this request!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Send it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.get(`/requisition/sendtohr/${id}/`, {method: 'get'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Request Sent!',
                            text: 'Request is sent.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                fetchCallBack()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Request can not be sent!',
                            text: deleteResult.message ? deleteResult.message : 'Request is not sent.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
        setData([])
    }
    
useEffect(() => {
fetchrequisitionData()
}, [setData])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          {/* <h5 className='mb-2'>Employee Requisition</h5> */}
        </div>
        {!loading ? (
                <>
                  <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Employee Requisition </Button>
                  {showform ?  <Card>
                  <CardBody> 
                  <h5 className='mb-2'>Employee Requisition</h5>
                <Row>  
                <Col md="6" className="mb-1">
                <Label className="form-label">
               Position <Badge color="light-danger">*</Badge>
                </Label>
                <Select
                    type="text"
                    name="position"
                    options={positiondropdown}
                    onChange={ (e) => { onChangeRequsitionDataHandler('position', 'select', e) }}
                    />
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Supervisor  <Badge color="light-danger">*</Badge>
                </Label>
                <Select
                    type="text"
                    name="supervisor"
                    options={employees}
                    onChange={ (e) => { onChangeRequsitionDataHandler('supervisor', 'select', e) }}
                    />
            </Col>    
            <Col md="6" className="mb-1">
            <Label className='form-label' for='default-picker'>
               Desired Start Date  <Badge color="light-danger">*</Badge>
            </Label>
            <Flatpickr className='form-control'  
            onChange={(date) => onChangeRequsitionDataHandler('desired_start_date', 'date', date)} 
            id='default-picker' 
            placeholder='Date'
            options={{
                disable: [
                function(date) {
                    const d = new Date()
                    return (date < d) 
                } 
                ]
              } }
            />
            </Col>
          
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Replacement Of
                </Label>
                <Select
                    type="text"
                    name="replacement_of"
                    options={employees}
                    onChange={ (e) => { onChangeRequsitionDataHandler('replacement_of', 'select', e) }}
                    />
            </Col>
            <Col md="6" className="mb-1">
                <Label className="form-label">
               Replacement For
                </Label>
                <Select
                    type="text"
                    name="replacement_for"
                    options={replacementdropdown}
                    onChange={ (e) => { onChangeRequsitionDataHandler('replacement_for', 'select', e) }}
                    />
            </Col>
            <Col md='6'>
            <Label className="form-label">
                        Required Candidates <Badge color="light-danger">*</Badge>
                    </Label>
                    <Input 
                    name='no_of_individuals'
                    id='no_of_individuals'
                    type='number'
                    onChange={(e) => onChangeRequsitionDataHandler('no_of_individuals', 'input', e)}
                    />
            </Col>
            <Col md='6'>
            <Label className="form-label">
                        Duration (In-Months)
                    </Label>
                    <Input 
                    name='no_of_individuals'
                    id='no_of_individuals'
                    type='number'
                    onChange={(e) => onChangeRequsitionDataHandler('duration', 'input', e)}
                    />
            </Col>
            <Col md={6}>
                {/* <Label>Select JD</Label> */}
                <Button onClick={toggleCanvasEnd} className='btn btn-primary mt-2'>Select JD</Button>
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
                                Position
                                </th>
                                <th scope="col" className="text-nowrap">
                                Supervisor
                                </th>
                                <th scope="col" className="text-nowrap">
                                Inititated By
                                </th>
                                <th scope="col" className="text-nowrap">
                                Desired Start Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Status
                                </th>
                                <th scope="col" className="text-nowrap">
                                Action
                                </th>

                                {/* <th scope="col" className="text-nowrap">
                                Actions
                                </th> */}
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.position_title ? item.position_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.supervisor_name ? item.supervisor_name : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.created_by_name ? item.created_by_name : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.desired_start_date ? item.desired_start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.status_title ? item.status_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                            <td className='p-1'>
                                            
                                            
                                            {item.status === 1 && (
                                                <Row>
                                            <Col className='col-6'>
                                                <button
                                                className="border-0 no-background"
                                                onClick={() => removeAction(item.id)}
                                                >
                                                <XCircle color="red" />
                                                </button>
                                            </Col>
                                             <Col className='col-6'>
                                             <button
                                             className="border-0 no-background"
                                             onClick={() => sendtohr(item.id)}
                                             >
                                             <Check color="green" />
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
                <div className="text-center">No Requisition Request Data Found!</div>
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
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <JDList CallBack={CallBack} selectedJD = {selectedJD}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default RequisitionRequest