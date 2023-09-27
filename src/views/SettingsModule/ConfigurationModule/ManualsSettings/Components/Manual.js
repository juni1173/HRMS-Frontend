import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, File, Save, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Manual = () => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [typeData] = useState([])
    const [manualForm, setManualForm] = useState({
      title: '',
      document: '',
      manual_type: ''
    })
    const onChangeManualFormDetailHandler = (InputName, InputType, e) => {
        
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
            InputValue = e.target.files[0]
        }

        setManualForm(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const preDataApi = async () => {
      setLoading(true)
      const response = await Api.get('/manual/types/')
      
      if (response.status === 200) {
          typeData.splice(0, typeData.length)
          const types = response.data
          for (let i = 0; i < types.length; i++) {
            typeData.push({value: types[i].id, label: types[i].title})
          }
      } else {
          return Api.Toast('error', 'Manual Types not found')
      }
      const manualResponse = await Api.get('/manuals/')
      if (manualResponse.status === 200) {
        setData(manualResponse.data)
    } else {
        return Api.Toast('error', 'Manuals not found')
    }
      setTimeout(() => {
        setLoading(false)
      }, 500)
  }
    const submitForm = async () => {
        setLoading(true)
        if (manualForm.title !== '' && manualForm.manual_type !== '' && manualForm.document !== '') {
            const formData = new FormData()
            formData.append('title', manualForm.title)
            formData.append('manual_type', manualForm.manual_type)
            formData.append('document', manualForm.document)
            await Api.jsonPost(`/manuals/`, formData, false).then(result => {
                if (result) {
                  console.warn(result)
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        preDataApi()
                    } else {
                        Api.Toast('error', result.message)

                    }
                }
            })
           
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Manual!",
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
                Api.deleteData(`/manuals/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Manual Deleted!',
                            text: 'Manual is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                              preDataApi()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Manual can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Manual is not deleted.',
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
      preDataApi()
      }, [setData])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Manual (SOP / EPM)</h5>
        </div>
        
        {!loading ? (
                <>
                    <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Title <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            name="title"
                            className='form-control'
                            onChange={ (e) => { onChangeManualFormDetailHandler('title', 'input', e) }}
                            placeholder="Title"
                        />
                    </Col>
                    <Col md='6' className='mb-1'>
                        <label className='form-label'>
                        Attachment <Badge color='light-danger'>*</Badge>
                        </label>
                        <Input type="file" 
                            name="document"
                            onChange={ (e) => { onChangeManualFormDetailHandler('document', 'file', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Type <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="type"
                            options={typeData}
                            onChange={ (e) => { onChangeManualFormDetailHandler('manual_type', 'select', e.value) }}
                        />
                    </Col>
                        <Col md={6}>
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
                    {Object.values(data).length > 0 ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Title
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        type
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Document
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.title}</td>
                                                <td>{item.manual_type_title}</td>
                                                <td><a className="btn btn-primary" href={item.document} target="_blank"><File /></a></td>
                                                <td>
                                                    <div className="d-flex row">
                                                    <div className="col">
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
                                        )}
                                    
                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Manual Found!</div>
                        )
                    }
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )}
        <hr></hr>
            </Col>
        </Row>
    </Fragment>
  )
}

export default Manual