import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, File, Save, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactPaginate from 'react-paginate'
let selectedIndex
const MachineAttendance = () => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [typeData] = useState([])
    const [currentitems, setcurrentitems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [Form, setForm] = useState({
        attendance_machine: '',
        attendance_file: ''
    })
   
    const onChangeAttendanceFormDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
             selectedIndex = typeData.findIndex(option => option.value === e)
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0]
            if (InputValue) {
                // Check if the file is a CSV file by examining its extension
                const fileNameParts = InputValue.name.split('.')
                const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase()
    
                if (fileExtension !== 'csv') {

                
                    // Display an error message or alert the user that only CSV files are allowed
                    // For example, you can show a toast message:
                    Api.Toast('error', 'Only CSV files are allowed')
                    // Clear the file input
                    e.target.value = null
                    InputValue = null
                }
            } 
        }

        setForm(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const preDataApi = async () => {
      setLoading(true)
      const response = await Api.get('/attendance/machines/')
      
      if (response.length > 0) {
          typeData.splice(0, typeData.length)
          const types = response
          for (let i = 0; i < types.length; i++) {
            typeData.push({value: types[i].id, label: types[i].machine_title})
          }
      } else {
        setTimeout(() => {
            setLoading(false)
          }, 500)
          return Api.Toast('error', 'Machine data not found')
      }
      const Response = await Api.get('/attendance/machine/data/')
      if (Response.status === 200) {
        setData(Response.data)
    } else {
        setTimeout(() => {
            setLoading(false)
          }, 500)
        return Api.Toast('error', 'Manuals not found')
    }
      setTimeout(() => {
        setLoading(false)
      }, 500)
  }
    const submitForm = async () => {
        setLoading(true)
        if (Form.attendance_machine !== '' && Form.attendance_file !== '') {
            const formData = new FormData()
            formData.append('attendance_machine', Form.attendance_machine)
            formData.append('attendance_file', Form.attendance_file)
            await Api.jsonPost(`/attendance/machine/data/`, formData, false).then(result => {
                if (result) {
                  console.warn(result)
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        preDataApi()
                        setForm({
                            attendance_machine: '',
                            attendance_file: ''
                        })
                        // Form.attendance_file = ''
                        // Form.attendance_machine = ''
                        selectedIndex = -1

                    } else {
                        Api.Toast('error', result.message)
                      Form.attendance_file = ''
                       
                    }
                }
            })
           
        } else {
            Api.Toast('error', 'Please fill all required fields!')
            Form.attendance_file = ''
           
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    // const removeAction = (id) => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: "Do you want to delete the Manual!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, Delete it!',
    //         customClass: {
    //         confirmButton: 'btn btn-primary',
    //         cancelButton: 'btn btn-danger ms-1'
    //         },
    //         buttonsStyling: false
    //     }).then(function (result) {
    //         if (result.value) {
    //             Api.deleteData(`/manuals/${id}/`, {method: 'Delete'})
    //             .then((deleteResult) => {
    //                 if (deleteResult.status === 200) {
    //                     MySwal.fire({
    //                         icon: 'success',
    //                         title: 'Manual Deleted!',
    //                         text: 'Manual is deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-success'
    //                         }
    //                     }).then(function (result) {
    //                         if (result.isConfirmed) {
    //                           preDataApi()
    //                         }
    //                     }) 
    //                 } else {
    //                     MySwal.fire({
    //                         icon: 'error',
    //                         title: 'Manual can not be deleted!',
    //                         text: deleteResult.message ? deleteResult.message : 'Manual is not deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-danger'
    //                         }
    //                     })
    //                 }
                            
    //                 })
    //         } 
    //     })
    // }
    useEffect(() => {
      preDataApi()
      }, [setData])

      const handlePageClick = (event) => {
        const newOffset = (event.selected * 25) % data.length
        setItemOffset(newOffset)
        }
        useEffect(() => {
            const endOffset = itemOffset === 0 ? 25 : itemOffset + 25           
            setcurrentitems(data.slice(itemOffset, endOffset))
            setPageCount(Math.ceil(data.length / 25))
            }, [itemOffset, data])
            
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Machine Attendance</h5>
        </div>
        
        {!loading ? (
                <>
                    <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Attendance Machine <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            // classNamePrefix='select'
                            name="type"          
                            options={typeData}
                            onChange={ (e) => { onChangeAttendanceFormDetailHandler('attendance_machine', 'select', e.value) }}
                            // defaultValue={typeData.findIndex(option => option.value === Form.attendance_machine) || null}
                        defaultValue={selectedIndex !== -1 ? typeData[selectedIndex] : null}
                        />
                    </Col>
                    <Col md='5' className='mb-1'>
                        <label className='form-label'>
                        Attendance File <Badge color='light-danger'>*</Badge>
                        </label>
                        <Input type="file" 
                            name="document"
                            onChange={ (e) => { onChangeAttendanceFormDetailHandler('attendance_file', 'file', e) }}
                            />
                    </Col>
                    
                        <Col md={3}>
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
                    {Object.values(currentitems).length > 0 ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Machine
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        File
                                        </th>
                                        
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(currentitems).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.attendance_machine_title}</td>
                                                <td><a className="btn btn-primary" href={item.attendance_file} target="_blank"><File /></a></td>
                                                </tr>
                                        )
                                        )}
                                    
                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )
                    }
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )}
        <hr></hr>
            </Col>
            <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName='pagination'
          pageLinkClassName='page-num'
          previousLinkClassName='page-num'
          nextLinkClassName='page-num'
          activeLinkClassName='active'
        />
        </Row>
    </Fragment>
  )
}

export default MachineAttendance