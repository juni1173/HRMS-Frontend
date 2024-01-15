import { Fragment, useEffect, useState, useRef } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge, UncontrolledTooltip, Card, CardBody  } from "reactstrap" 
import { Save, XCircle, HelpCircle, FileText } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
const Gym = ({yearoptions}) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [yearvalue, setYearValue] = useState(null)
    const yearValueRef = useRef(null)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [showform, setshowform] = useState(false)
    const [reimbursementData, setReimbursementData] = useState({
        amount: '',
        date : new Date()
   })
   const [gym_receipt, setGym_Receipt] = useState(null)
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

    }
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setGym_Receipt(e.target.files[0]) 
        }
      } 
    const remove_gym_receipt = () => {
        setGym_Receipt(null) 
      } 
      const gymdata = async () => {
        setLoading(true)
        const formData = new FormData()
        formData['year'] = yearvalue
        const response = await Api.jsonPost('/reimbursements/employee/recode/gym/data/', formData)
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
      gymdata()
    }
    const submitForm = async () => {
        setIsButtonDisabled(true)
        if (reimbursementData.amount !== '' && reimbursementData.date !== '') {
            const formData = new FormData()
            formData.append('amount', reimbursementData.amount)
            formData.append('date', reimbursementData.date)
            if (gym_receipt !== null) formData.append('gym_receipt', gym_receipt)
            await Api.jsonPost(`/reimbursements/employees/gym/allowance/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        Api.Toast('success', result.message)
                        setGym_Receipt(null) 
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
                Api.deleteData(`/reimbursements/employees/gym/allowance/${id}/`, {method: 'Delete'})
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
    
useEffect(() => {
gymdata()
}, [setData, yearvalue])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Gym Allowance</h5>
          {/* <small>Add position.</small> */}
        </div>
        {!loading ? (
                <>
                  <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Request Gym Allowance </Button>
                  {showform ?  <Card>
                  <CardBody> 
                  <h5 className='mb-2'>Claim Gym Allowance</h5>
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
              <Col md='6' className='mb-1'>
                <label className='form-label'>
                  Amount <Badge color="light-danger">*</Badge> 
                </label>
                <Input type="number" 
                    name="amount"
                    min="0"
                    onChange={ (e) => { onChangeReimbursementDetailHandler('amount', 'input', e) }}
                    placeholder="Amount"  />
              </Col>
              <Col md={6}>
              <Label className="form-label">Receipt <Badge color="light-danger">*</Badge> </Label>
              {gym_receipt ? (
              <div className="float-right">
                {/* <img
                  src={gym_receipt ? URL.createObjectURL(gym_receipt) : pdfImage}
                  alt="Thumb"
                  width="50"
                /> */}
                <FileText color='green'/>
                <button className="btn" onClick={remove_gym_receipt}>
                  <XCircle />
                </button>
              </div>
                ) : (
                <div>
                    <Input
                        type="file"
                        id="gym_receipt"
                        name="gym_receipt"
                        accept="image/*"
                        onChange={imageChange}
                        />
                </div>
                )}
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
        <Col md={6} className="mt-2">
    <Label>Search By Year</Label>
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
                                Monthly Limit
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
                                        <td>{item.gym_monthly_limit ? item.gym_monthly_limit : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.gym_receipt ? <a target='_blank' href={`${process.env.REACT_APP_PUBLIC_URL}${item.gym_receipt}`}> <FileText /> </a> : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>
                                        <Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge> 
                                        {item.decision_reason && (<> <HelpCircle id={`UnControlledGym${key}`}/><UncontrolledTooltip  target={`UnControlledGym${key}`}>{item.decision_reason} </UncontrolledTooltip></>)}
                                        </td>
                                        
                                            <td className='p-1'>
                                            {item.status === 'in-progress' && (
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
                <div className="text-center">No Gym Allowance Data Found!</div>
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

export default Gym