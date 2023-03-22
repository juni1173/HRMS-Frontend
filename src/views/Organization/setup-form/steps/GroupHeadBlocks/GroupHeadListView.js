// ** Reactstrap Imports
import { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import { Check, X, XCircle, Edit, Save, Search } from 'react-feather'
import { useForm } from 'react-hook-form'
import SearchHelper from '../../../../Helpers/SearchHelper/SearchByObject'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import {
    Row,
    Form,
    Col,
    Modal,
    Input,
    Label,
    Button,
    ModalBody,
    ModalHeader, InputGroup, InputGroupText,
    Table
  } from 'reactstrap'
  import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
const GroupHeadList = ({groupHeadList, deleteGHeadID, updatedGHeadID, fetchGroupHeads }) => {
    const [editModal, setEditModal] = useState(false)
    const [editIDState, setEditIDState] = useState(null)
    const [updatedTitle, setUpdatedTitle] = useState('')
    const [updatedType, setUpdatedType] = useState(null) 
    const [updatedDescription, setUpdatedDescription] = useState('')
    const searchHelper = SearchHelper()
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [editData, setEditData] = useState({
        title: "",
        grouphead_type: 1,
        is_status: 0,
        is_active: 0,
        description: null,
        organization_id: null
    })
    const organization = JSON.parse(localStorage.getItem('organization'))
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
      // const groupStatus = [
      //   { value: 0, label: 'Inactive' },
      //   { value: 1, label: 'Active' }
      // ]
      const groupType = [
        { value: 1, label: 'Technical' },
        { value: 2, label: 'Non-Technical' }
      ]
      const defaultValues = {
        title: editData.title,
        group_type: editData.grouphead_type,
        group_status: editData.is_active,
        group_description: editData.description
      }
      const getSearch = options => {
        if (options.value === '' || options.value === null || options.value === undefined) {
    
            if (options.key in searchQuery) {
                delete searchQuery[options.key]
            } 
            if (Object.values(searchQuery).length > 0) {
                options.value = {query: searchQuery}
            } else {
                options.value = {}
            }
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setSearchResults(searchHelper.searchObj(options))
        }
    }
    const {
        // control,
        setError,
        handleSubmit,
        formState: {  }
      } = useForm({ defaultValues })    
      const getGHeadByID = (id) => {
        if (id) {
            fetch(`${process.env.REACT_APP_API_URL}/organization/grouphead/${id}/`, {
                method: "GET",
                headers: { "Content-Type": "Application/json", Authorization: token }
              })
              .then((response) => response.json())
              .then((result) => {
                const data = {status:result.status, result_data:result.data, message: result.message }
                if (data.status === 200) {
                //   console.warn(data.result_data)
                  setEditData(data.result_data)
                  setUpdatedDescription(data.result_data.description)
                  setEditIDState(id)
                //   const defaultValues = data.result_data
                setEditModal(true)
                } else {
                  toast.error(
                    <ToastContent type='error' message={data.message} />,
                    { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                  )
                }
                
                // stepper.next()
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
            //   stepper.next()
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
      
      const updateGHead = (data, id) => {
        if (Object.values(data).length > 0 && id) {
            fetch(`${process.env.REACT_APP_API_URL}/organization/grouphead/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "Application/json", Authorization: token },
                body: JSON.stringify(data) 
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 200) {
                    toast.success(
                        <ToastContent type='success' message={result.message} />,
                        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                      )
                      updatedGHeadID(id)
                      if (typeof (fetchGroupHeads) !== undefined) {
                        fetchGroupHeads()
                      }
                     
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
        if (updatedTitle !== undefined || updatedDescription !== undefined || organization.id !== undefined) {
          const formData = new FormData()
          // return false
            formData['title'] =  !updatedTitle ? defaultValues.title : updatedTitle
            if (updatedType) formData['grouphead_type'] =  updatedType
            // formData['is_status'] =  !updatedStatus ? defaultValues.group_status : updatedStatus
            formData['description'] =  updatedDescription
            formData['organization_id'] = organization.id 
            // console.warn(formData)
            updateGHead(formData, editIDState)
            
        } else {
            toast.error(
                <ToastContent type='error' message='You have not made any changes' />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
        }
      }
      useEffect(() => {
        setSearchResults(groupHeadList)
      }, [groupHeadList])
  return (
    <Fragment>
      <div className='row'>
        <div className='col-md-6 my-1'>
            <h3 className=''>Group Heads List</h3>
        </div>
        <div className='col-md-6 px-1'>
        <InputGroup className='input-group-merge mb-2'>
            <InputGroupText>
            <Search size={14} />
            </InputGroupText>
            <Input placeholder='search title...' onChange={e => { getSearch({list: groupHeadList, key: 'title', value: e.target.value }) } }/>
        </InputGroup>
        </div>
      </div>
      <Table bordered striped responsive>
        <thead className='table-dark text-center'>
          <tr>
            <th scope="col" className="text-nowrap">
              Title
            </th>
            <th scope="col" className="text-nowrap">
              Type
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
          {Object.values(searchResults).length > 0 ? (
            <>
            {Object.values(searchResults).map((item, key) => (
                !item.is_active ? null : (
                    <tr key={key}>
                  <td>{item.title}</td>
                  <td>{groupType.find(pre => pre.value === item.grouphead_type) ? groupType.find(pre => pre.value === item.grouphead_type).label : 'N/A'}</td>
                  <td>{item.description}</td>
                  <td>
                    <div className="d-flex row">
                      <div className="col text-center">
                        <button
                          className="border-0"
                          onClick={() => {
                            getGHeadByID(item.id) 
                          }}
                        >
                          <Edit color="orange" />
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className="border-0"
                          onClick={() => deleteGHeadID(item.id)}
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
              <td colSpan={4}>No Group Head Found...</td>
            </tr>
          )}
          
        </tbody>
      </Table>
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit Group Head</h1>
            {/* <p>Updating details will receive a privacy audit.</p> */}
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}  id="groupHeadForm">
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`group-title`}>
              Title
            </Label>
            <Input type='text' name={`title`} id={`title`} placeholder='Group Title' defaultValue={defaultValues.title} onChange={e => setUpdatedTitle(e.target.value)}/>
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`type`}>
              Type
            </Label>
            <Select
              theme={groupType}
              isClearable={false}
              id='group-type'
              name='group-type'
              className='react-select'
              classNamePrefix='select'
              options={groupType}
              defaultValue={editData.grouphead_type === 1 ? groupType[0] : groupType[1]}
              onChange={type => setUpdatedType(type.value)}
            />
          </Col>
          {/* <Col md='3' className='mb-1'>
            <Label className='form-label' for={`group-status`}>
              Status
            </Label>
            <Select
              theme={groupStatus}
              isClearable={false}
              id='group-status'
              name='group-status'
              className='react-select'
              classNamePrefix='select'
              options={groupStatus}
              defaultValue={defaultValues.group_status ? groupStatus[1] : groupStatus[0]}
              onChange={status => setUpdatedStatus(status.value)}
            />
          </Col> */}
        </Row>
        <Row>
          <Col md='12' className='mb-1'>
            <Label className='form-label' for={`group`}>
              Description
            </Label>
            <Input type='textarea' row="3" name='group_description' id='group_description' placeholder='Description' defaultValue={defaultValues.group_description} onChange={e => setUpdatedDescription(e.target.value)}/>
          </Col>
        </Row>
          <div className='Text-center'>
              <Button color='success' className='btn-next me-1' onClick={onSubmit}>
                <span className='align-middle d-sm-inline-block d-none'>Update</span>
                <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
              </Button>
          </div>
      </Form>
        </ModalBody>
      </Modal>
    </Fragment>
    
  ) 
} 

export default GroupHeadList 
