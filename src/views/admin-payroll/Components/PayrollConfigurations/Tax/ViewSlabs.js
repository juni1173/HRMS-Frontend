import {useState, useEffect, Fragment} from 'react'
import { Edit, Trash2 } from 'react-feather'
import { Table, Row, Col, CardBody, Card, Spinner, Button, Modal, ModalBody, ModalHeader} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import UpdateSlab from './UpdateSlab'
import AddTax from './AddTax'
import apiHelper from '../../../../Helpers/ApiHelper'


const ViewSlabs = () => {
    // debugger
    const isSuperuser = JSON.parse(localStorage.getItem('is_superuser'))
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)
const [currentSlab, setCurrentSlab] = useState()
    const DiscardModal = () => {
        setShow(false)
      }
    const getData = async () => {
        setLoading(true)
        await Api.get(`/payroll/view/tax/slab/`).then(result => {
            if (result) {
                if (result.status === 200) {     
                    setData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
               
                Api.Toast('error', 'Server not respnding')
            }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
    }
    const lockSlab = (id) => {
        MySwal.close()
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to lock the tax slab!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Lock it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (swalResult) {
            if (swalResult.value) {
                Api.get(`/payroll/slab/lock/${id}/`, { method: 'get' })
                    .then((lockResult) => {
                        if (lockResult.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Tax Slab Locked!',
                                text: 'Tax Slab is locked.',
                                customClass: {
                                    confirmButton: 'btn btn-success'
                                }
                            }).then(function (confirmResult) {
                                if (confirmResult.isConfirmed) {
                                    getData()
                                }
                            })
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Tax Slab can not be locked!',
                                text: lockResult.message ? lockResult.message : 'Tax Slab is not locked.',
                                customClass: {
                                    confirmButton: 'btn btn-danger'
                                }
                            }).then(function (confirmResult) {
                                if (confirmResult.isConfirmed) {
                                    getData()
                                }
                            })
                        }
                    })
            }
        })
    }
    
    const unlockSlab = (id) => {
        MySwal.close()
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to unlock the tax slab!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, UnLock it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (swalResult) {
            if (swalResult.value) {
                try {
                    Api.get(`/payroll/slab/unlock/${id}/`, { method: 'get' })
                    .then((unlockResult) => {
                        if (unlockResult.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Tax Slab UnLocked!',
                                text: 'Tax Slab is Unlocked.',
                                customClass: {
                                    confirmButton: 'btn btn-success'
                                }
                            }).then(function (confirmResult) {
                                if (confirmResult.isConfirmed) {
                                    getData()
                                }
                            })
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Tax Slab can not be unlocked!',
                                text: unlockResult.message ? unlockResult.message : 'Tax Slab is not unlocked.',
                                customClass: {
                                    confirmButton: 'btn btn-danger'
                                }
                            }).then(function (confirmResult) {
                                if (confirmResult.isConfirmed) {
                                    getData()
                                }
                            })
                        }
                    })
                } catch (error) {
                   console.log(error) 
                }
               
            }
        })
    }
    
    const deleteSlab = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the tax slab!",
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
                Api.deleteData(`/payroll/delete/tax/slab/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Tax Slab Deleted!',
                            text: 'Tax Slab is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                             getData()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Tax Slab can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Tax Slab is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
 const CallBack = () => {
    getData()
    setShow(false)
  }
    useEffect(() => {
        getData()
      }, [setData, isSuperuser])
  return (
    <Fragment>
    <Row>
        
        <Col md={12}>
            {isSuperuser ? <AddTax callBack={CallBack}/> : null}
            <Card>
                <CardBody>
                    <Row className='mb-2'>
                        <Col md={6}>
                            <h3>Tax</h3>
                        </Col>
                    </Row>
                    {!loading ? (
    Object.keys(data).length > 0 ? (
        Object.keys(data).map(country => (
            <div key={country}>
                <h2>{country} Tax Slabs</h2>
                <Table responsive bordered striped>
                    <thead className='table-dark text-center'>
                        <tr>
                            <th>Initial Amount</th>
                            <th>Ceiling Amount</th>
                            <th>Tax Rate</th>
                            <th>Exemption Amount</th>
                            <th>Fixed Amount</th>
                            <th>Year</th>
                            {isSuperuser ? <>
                            <th>Actions</th>
                            <th>TaxRealm</th> </> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {data[country].map((item, key) => (
                            item.is_active ? (
                                <tr key={key}>
                                    <td>{item.initial_income_threshold ? item.initial_income_threshold : 'N/A'}</td>
                                    <td>{item.income_ceiling ? item.income_ceiling : 'N/A'}</td>
                                    <td>{item.tax_rate ? item.tax_rate : 'N/A'}</td>
                                    <td>{item.exemption_amount ? item.exemption_amount : 'N/A'}</td>
                                    <td>{item.fixed_amount ? item.fixed_amount : 'N/A'}</td>
                                    <td>{item.year ? item.year : 'N/A'}</td>
                                    {isSuperuser ? <>
                                    {!item.is_lock ? <td>
                                        <button
                                            className="border-0 no-background"
                                            title="Edit"
                                            onClick={e => {
                                                e.preventDefault()
                                                setCurrentSlab(item)
                                                setShow(true)
                                            }}
                                        >
                                            <Edit color='orange'/>
                                        </button>
                                        <button
                                            className="border-0 no-background"
                                            title="Delete"
                                            onClick={() => deleteSlab(item.id)}
                                        >
                                           <Trash2 color="red"/>
                                        </button>
                                    </td > : <td><div className='text-center'>Locked</div></td> }
                                    <td>
                        {item.is_lock ?  <Button type="submit" color="danger" className="me-1" onClick={() => unlockSlab(item.id)}>
            Unlock
          </Button> : <Button type="submit" color="success" className="me-1" onClick={() => lockSlab(item.id)}>
            Lock
          </Button> }
                                    </td> </> : null }
                                </tr>
                            ) : null
                        ))}
                    </tbody>
                </Table>
            </div>
        ))
    ) : (
        <div>
            <p className='text-center'>No Tax Slabs Found</p>
        </div>
    )
) : (
    <div>
        <Spinner color='primary' type='grow'/>
    </div>
)}
                </CardBody>
            </Card>
                
        </Col>
    </Row>
    <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1>Edit Tax Slab</h1>
          </div>
            <UpdateSlab Slab={currentSlab} CallBack={CallBack} DiscardModal={DiscardModal}/> 
        </ModalBody>
      </Modal>
  </Fragment>
  )
}

export default ViewSlabs