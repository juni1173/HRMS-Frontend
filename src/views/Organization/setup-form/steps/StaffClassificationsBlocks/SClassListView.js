// ** Reactstrap Imports
import { Fragment, useState, useEffect } from 'react'
import { Check, X, XCircle, Edit, Save, Plus, Minus, Search } from 'react-feather'
import { useForm } from 'react-hook-form'
import InputNumber from 'rc-input-number'
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
    ModalHeader, InputGroup, InputGroupText,
    Table,
    Badge
  } from 'reactstrap'
  import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import SearchHelper from '../../../../Helpers/SearchHelper/SearchByObject'
const SClassListView = ({SClassList, deleteSClassID, updatedSClassID }) => {
    const [editModal, setEditModal] = useState(false)
    const [editIDState, setEditIDState] = useState(null)
    const [updatedTitle, setUpdatedTitle] = useState('')
      const [updatedLevel, setUpdatedLevel] = useState('')
      const searchHelper = SearchHelper()
      const [searchResults, setSearchResults] = useState([])
      const [searchQuery] = useState([])
    const [editData, setEditData] = useState({
        title: "",
        level: 1,
        // sclass_status: 0,
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
      // const sclassStatus = [
      //   { value: 0, label: 'Inactive' },
      //   { value: 1, label: 'Active' }
      // ]
      const defaultValues = {
        title: editData.title,
        level: editData.level
        // sclass_status: editData.is_status
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
      const getSClassByID = (id) => {
        if (id) {
            fetch(`${process.env.REACT_APP_API_URL}/organizations/staff_classification/${id}/`, {
                method: "GET",
                headers: { "Content-Type": "Application/json", Authorization: token }
              })
              .then((response) => response.json())
              .then((result) => {
                if (result.status === 200) {
                  setEditData(result.data)
                  setEditIDState(id)
                  setUpdatedLevel(result.data.level)
                setEditModal(true)
                } else {
                  toast.error(
                    <ToastContent type='error' message={result.message} />,
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
      
      // const [updatedStatus, setUpdatedStatus] = useState(defaultValues.sclass_status)
      const updateSClass = (data, id) => {
        if (Object.values(data).length > 0 && id) {
            fetch(`${process.env.REACT_APP_API_URL}/organizations/staff_classification/${id}/`, {
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
                      updatedSClassID(id)
                     
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
        if (updatedTitle !== undefined || updatedLevel !== undefined) {
          const formData = new FormData()
            formData['title'] =  !updatedTitle ? defaultValues.title : updatedTitle
            formData['level'] = !updatedLevel ? defaultValues.level : updatedLevel
            // formData['is_status'] =  !updatedStatus ? defaultValues.sclass_status : updatedStatus
            formData['organization_id'] = organization.id 
            updateSClass(formData, editIDState)
            
        } else {
            toast.error(
                <ToastContent type='error' message='You have not made any changes' />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
        }
      }
      useEffect(() => {
        setSearchResults(SClassList)
      }, [SClassList])
  return (
    <Fragment>
      <div className='row'>
          <div className='col-md-6 my-1'>
              <h3 className=''>Staff Classification List</h3>
          </div>
          <div className='col-md-6 px-1'>
          <InputGroup className='input-group-merge mb-2'>
              <InputGroupText>
              <Search size={14} />
              </InputGroupText>
              <Input placeholder='search title...' onChange={e => { getSearch({list: SClassList, key: 'title', value: e.target.value }) } }/>
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
              Initial
            </th>
            <th scope="col" className="text-nowrap">
              Level
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
                  <td>{item.initial ? <Badge color='light-success'> {item.initial} </Badge> : <Badge color='light-danger'>N/A</Badge>}</td>
                  <td>{item.level}</td>
                  <td>
                    <div className="d-flex row">
                      <div className="col text-center">
                        <button
                          className="border-0"
                          onClick={() => {
                            getSClassByID(item.id) 
                          }}
                        >
                          <Edit color="orange" />
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className="border-0"
                          onClick={() => deleteSClassID(item.id)}
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
              <td colSpan={4}>No Staff Classification Found...</td>
            </tr>
          )}
          
        </tbody>
      </Table>
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit Staff Classification</h1>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}  id="sclassHeadForm">
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`sclass-title`}>
              Title
            </Label>
            <Input type='text' name={`title`} id={`title`} placeholder='SClass Title' defaultValue={defaultValues.title} onChange={e => setUpdatedTitle(e.target.value)}/>
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='min-max-number-input'>
                    Priority Level [ 1 - 30 ]
                </Label>
                <InputNumber
                    className='input-lg'
                    min={1}
                    max={30}
                    defaultValue={defaultValues.level}
                    upHandler={<Plus />}
                    downHandler={<Minus />}
                    id='min-max-number-input'
                    onChange={value => setUpdatedLevel(value)}
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

export default SClassListView 
