import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { Save, XCircle, Edit2 } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Update from './UpdateLeaves'
const Leaves = ({ staffdropdown, data, CallBack }) => {
    const isSuperuser = JSON.parse(localStorage.getItem('is_superuser'))
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
const [currentLeaves, setCurrentLeaves] = useState()
    const [leave_types] = useState([])
    const [is_sc, setIsSC] = useState(false)
    const [leaveData, setLeaveData] = useState({
        leave_types: '',
        allowed_leaves : '',
        staff_classification: ''
   })
   const DiscardModal = () => {
    setShow(false)
  }
  const handleModalClosed = () => {
    setShow(false)
  }
  const CallBackLeaves = () => {
    CallBack()
    setShow(false)
  }
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
        setLoading(true)
        if (leaveData.allowed_leaves !== '' && leaveData.leave_types !== '') {
            const formData = new FormData()
            formData['leave_types'] = leaveData.leave_types 
            formData['allowed_leaves'] = leaveData.allowed_leaves
            if (leaveData.staff_classification !== '' && is_sc) formData['staff_classification'] = leaveData.staff_classification
            await Api.jsonPost(`/reimbursements/set/leave/duration/limit/`, formData).then(result => {
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
            text: "Do you want to delete the Leave Limit!",
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
                Api.deleteData(`/reimbursements/set/leave/duration/limit/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Leave Limit Deleted!',
                            text: 'Leave Limit is deleted.',
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
                            title: 'Leave Limit can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Leave Limit is not deleted.',
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
        leave_types_dropdown()
    }, [data])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'> Leaves limit</h5>
          {/* <small>Add position.</small> */}
        </div>
        {isSuperuser ? <>
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
                    menuPlacement="auto" 
                    menuPosition='fixed'
                />
        </Col> </> :    <div className='text-center mb-2 fw-bold'>Please contact developers team to change the limit</div>
        }
        {Object.values(staffdropdown).length > 0 ?  (
            // !loading ? (
                <>
                {isSuperuser ? <> 
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
                    menuPlacement="auto" 
                    menuPosition='fixed'
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
            </Row> </> : null}
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
                                Leave Type
                                </th>
                                <th scope="col" className="text-nowrap">
                                Allowed Leaves
                                </th>
                                {isSuperuser ? <th scope="col" className="text-nowrap">
                                Actions
                                </th> : null}
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {
                                    !loading ? (
                                Object.values(data.duration).map((item, key) => (
                                        <tr key={key}>
                                        <td>{item.staff_classification_title ? item.staff_classification_title : 'N/A' }</td>
                                        <td>{item.leave_types_title ? item.leave_types_title : 'N/A'}</td>
                                        <td>{item.allowed_leaves ? item.allowed_leaves : 'N/A'}</td>
                                        {isSuperuser ?       <td>
                                            <div className="d-flex row">
                                            <div className="col-md-6">
                                                <button
                                                className="border-0"
                                                onClick={e => {
                                                    e.preventDefault()
                                                    // setModalType('Edit')
                                                    setCurrentLeaves(item)
                                                    setShow(true)
                                                }} 
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
                                        </td> : null}
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
        <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1> Leaves </h1>
          </div>
            <Update value={currentLeaves} apiEndPoint={"/reimbursements/set/leave/duration/limit/"} CallBack={CallBackLeaves} DiscardModal={DiscardModal}/>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Leaves