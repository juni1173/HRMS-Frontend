import { Fragment, useState } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, Save, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ProvidentFund = ({ data, CallBack }) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [pfData, setPfData] = useState({
        percentage: ''
   })
    const onChangePFDetailHandler = (InputName, InputType, e) => {
        
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

        setPfData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        setLoading(true)
        if (pfData.percentage !== '') {
            const formData = new FormData()
            formData['percentage'] = pfData.percentage
            await Api.jsonPost(`/reimbursements/set/provident-fund/percentage/`, formData).then(result => {
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
            Api.Toast('error', 'Please fill all required fields!')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    // const removeAction = (id) => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: "Do you want to delete the PF Limit!",
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
    //             Api.deleteData(`/reimbursements/set/provident-fund/percentage/${id}/`, {method: 'Delete'})
    //             .then((deleteResult) => {
    //                 if (deleteResult.status === 200) {
    //                     MySwal.fire({
    //                         icon: 'success',
    //                         title: 'PF limit Deleted!',
    //                         text: 'PF limit is deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-success'
    //                         }
    //                     }).then(function (result) {
    //                         if (result.isConfirmed) {
    //                             CallBack()
    //                         }
    //                     }) 
    //                 } else {
    //                     MySwal.fire({
    //                         icon: 'error',
    //                         title: 'PF limit can not be deleted!',
    //                         text: deleteResult.message ? deleteResult.message : 'PF limit is not deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-danger'
    //                         }
    //                     })
    //                 }
                            
    //                 })
    //         } 
    //     })
    // }
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Add Provident Fund %</h5>
          {/* <small>Add position.</small> */}
        </div>
        
        {!loading ? (
                <>
                    <Row>
                    <Col md='4' className='mb-1'>
                        <label className='form-label'>
                        Percentage<Badge color='light-danger'>*</Badge>
                        </label>
                        <Input type="number" 
                            name="percentage"
                            onChange={ (e) => { onChangePFDetailHandler('percentage', 'input', e) }}
                            placeholder="Percentage"  />
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
                    </Row>
                    {data && (Object.values(data).length > 0) ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Percentage
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.percentage}%</td>
                                                <td>
                                                    <div className="d-flex row">
                                                    <div className="col">
                                                        {/* <button
                                                        className="border-0"
                                                        onClick={() => removeAction(item.id)}
                                                        >
                                                        <XCircle color="red" />
                                                        </button> */}
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
                            <div className="text-center">No PF Data Found!</div>
                        )
                    }
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

export default ProvidentFund