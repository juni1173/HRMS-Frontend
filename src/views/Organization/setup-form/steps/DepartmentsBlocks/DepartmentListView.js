// ** Reactstrap Imports
import { Fragment, useState } from 'react'
import Select from 'react-select'
import { Check, X, XCircle, Edit, Save } from 'react-feather'
import { useForm } from 'react-hook-form'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/input-number/input-number.scss'
import {
    Row,
    Form,
    Col,
    Modal,
    Input,
    Label,
    Button,
    ModalBody,
    ModalHeader,
    // FormFeedback,
    Table
  } from 'reactstrap'
  import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
const DepListView = ({DepList, groupHead, groupHeadActive, deleteDepID, updatedDepID }) => {
    // console.warn(groupHead)
    const [editModal, setEditModal] = useState(false)
    const [editIDState, setEditIDState] = useState(null)
    const [editData, setData] = useState([
        {
            grouphead: null,
            department_title: '',
            department_status: true,
            department_description:''
        }
    ])
    let token = localStorage.getItem('accessToken')
    token = token.replaceAll('"', '')
    token = `Bearer ${token}`
    const ToastContent = ({ type, message }) => (
        type === 'success' ? (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='success' icon={<Check size={12} />} />
              <h6 className='toast-title fw-bold'>Succesfull</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>) : (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='danger' icon={<X size={12} />} />
              <h6 className='toast-title fw-bold'>Error</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>
        )
      )
      const DepStatus = [
        { value: 0, label: 'Inactive' },
        { value: 1, label: 'Active' }
      ]
      const defaultValues = {
        gHeadID: editData.grouphead,
        title: editData.title,
        Dep_status: editData.status,
        Dep_description: editData.description
      }
    const {
        // control,
        setError,
        handleSubmit,
        formState: {  }
      } = useForm({ defaultValues })    
      const getDepByID = (id) => {
        if (id) {
            fetch(`${process.env.REACT_APP_API_URL}/organization/department/${id}/`, {
                method: "GET",
                headers: { "Content-Type": "Application/json", Authorization: token }
              })
              .then((response) => response.json())
              .then((result) => {
                if (result.status === 200) {

                  setData(result.data)
                  setEditIDState(id)
                  setEditModal(true)
                  toast.success(
                    <ToastContent type='success' message={result.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                  )
                } else {
                  toast.error(
                    <ToastContent type='error' message={result.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                  )
                }
                
              })
              .catch((error) => {
                console.error(error)
                toast.error(
                  <ToastContent type='error' message='Invalid Request' />,
                  { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
              }) 
            } else {
            //   console.warn(data)
              stepper.next()
              for (const key in data) {
                if (data[key].length === 0) {
                  setError(key, {
                    type: 'manual',
                    message: `Please enter a valid detail`
                  })
                }
              }
            }
      }
      const [updatedGHeadID, setGHeadID] = useState()
      const [updatedTitle, setUpdatedTitle] = useState(defaultValues.title)
      const [updatedDescription, setUpdatedDescription] = useState(defaultValues.Dep_description)
      const [updatedStatus, setUpdatedStatus] = useState(defaultValues.Dep_status)
      const updateDep = (data, id) => {
        if (Object.values(data).length > 0 && id) {
            fetch(`${process.env.REACT_APP_API_URL}/organization/department/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "Application/json" },
                body: JSON.stringify(data) 
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 200) {
                    toast.success(
                        <ToastContent type='success' message={result.message} />,
                        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                      )
                      updatedDepID(id)
                     
                } else {
                    toast.error(
                    <ToastContent type='error' message={result.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                    )
                }
            })
        } else {
            toast.error(
                <ToastContent type='error' message='Something Went Wrong! Try Again!' />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
        }
      }
     
      const onSubmit = () => {
        if (updatedTitle !== undefined || updatedDescription !== undefined || updatedStatus !== undefined || updatedGHeadID !== undefined) {
          const formData = new FormData()
          console.warn(updatedGHeadID)
            formData['grouphead'] = !updatedGHeadID ? editData.grouphead : updatedGHeadID
            formData['title'] =  !updatedTitle ? editData.departemnt_title : updatedTitle
            formData['status'] =  !updatedStatus ? editData.department_status : updatedStatus
            formData['description'] = !updatedDescription ? editData.department_description : updatedDescription
            // console.warn(formData)
            updateDep(formData, editIDState)
            
        } else {
            toast.error(
                <ToastContent type='error' message='You have not made any changes' />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
        }
      }
  return (
    <Fragment>
      <div className='divider'>
        <div className='divider-text'><h3 className='my-1'>Departments List</h3></div>
      </div>  
      <Table bordered striped responsive>
        <thead className='table-dark text-center'>
          <tr>
            <th scope="col" className="text-nowrap">
              Title
            </th>
            <th scope="col" className="text-nowrap">
              Group Head
            </th>
            <th scope="col" className="text-nowrap">
              Status
            </th>
            <th scope="col" className="text-nowrap">
              Description
            </th>
            <th scope="col" className="text-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {DepList ? (
            <>
            {Object.values(DepList).map((item, key) => (
                !item.is_active ? null : (
                    <tr key={key}>
                  <td>{item.title}</td>
                  <td>
                  {Object.values(groupHead).map((gitem) => (gitem.value === item.grouphead ? gitem.label : null))}
                  </td>
                  <td>{item.status ? 'Active' : 'InActive'}</td>
                  <td>{item.description}</td>
                  <td>
                    <div className="d-flex row">
                      <div className="col text-center">
                        <button
                          className="border-0"
                          onClick={() => {
                            getDepByID(item.id) 
                          }}
                        >
                          <Edit color="orange" />
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className="border-0"
                          onClick={() => deleteDepID(item.id)}
                        >
                          <XCircle color="red" />
                        </button>
                      </div>
                    </div>
                  </td>
                  </tr>
                )
              ))}
            </>
          ) : (
            <tr>
              <td>No Data Found</td>
            </tr>
          )}
          
        </tbody>
      </Table>
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit Departments</h1>
            {/* <p>Updating details will receive a privacy audit.</p> */}
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}  id="DepHeadForm">
        <Row>
        <Col md='3' className='mb-1'>
            
              <Label className='form-label' for={`country`}>
                Group Head
              </Label>
              <Select
                isClearable={false}
                id={`dep-grouphead`}
                className='react-select'
                classNamePrefix='select'
                options={groupHeadActive}
                defaultValue={Object.values(groupHeadActive).map((gitem) => (gitem.value === defaultValues.gHeadID ? gitem : null))}
                onChange={ ghead => setGHeadID(ghead.value)}
              />
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`Dep-title`}>
              Title
            </Label>
            <Input type='text' name={`title`} id={`title`} placeholder='Dep Title' defaultValue={defaultValues.title} onChange={e => setUpdatedTitle(e.target.value)}/>
          </Col>
          <Col md='3' className='mb-1'>
            <Label className='form-label' for={`Dep-status`}>
              Status
            </Label>
            <Select
              theme={DepStatus}
              isClearable={false}
              id='Dep-status'
              name='Dep-status'
              className='react-select'
              classNamePrefix='select'
              options={DepStatus}
              defaultValue={DepStatus[defaultValues.Dep_status ? 1 : 0]}
              onChange={status => setUpdatedStatus(status.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col md='12' className='mb-1'>
            <Label className='form-label' for={`dep-description`}>
              Description
            </Label>
            <Input
            type='textarea'
            row='3'
            id='dep-description'
            name='dep-description'
            defaultValue={defaultValues.Dep_description}
            onChange={e => setUpdatedDescription(e.target.value)}
            />
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <div className='d-flex'>
              <Button color='success' className='btn-next me-1' onClick={onSubmit}>
                <span className='align-middle d-sm-inline-block d-none'>Update</span>
                <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
              </Button>
          </div>
          
        </div>
      </Form>
        </ModalBody>
      </Modal>
    </Fragment>
    
  ) 
} 

export default DepListView 