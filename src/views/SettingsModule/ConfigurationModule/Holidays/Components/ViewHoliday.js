import {useState, useEffect, Fragment} from 'react'
import { Edit, Trash2 } from 'react-feather'
import { Table, Row, Col, CardBody, Card, Spinner, Button, Modal, ModalBody, ModalHeader} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AddHoliday from './AddHoliday'
import UpdateHoliday from './UpdateHoliday'
import apiHelper from '../../../../Helpers/ApiHelper'


const View_Holiday = () => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [HolidaysList, setHolidaysList] = useState([])
    const [show, setShow] = useState(false)
    const [modalType, setModalType] = useState('Add New')
const [currentHoliday, setCurrentHoliday] = useState()
    const DiscardModal = () => {
        setShow(false)
      }
      const handleModalClosed = () => {
        setModalType('Add New')
      }
    const getHolidays = async () => {
        setLoading(true)
        await Api.get(`/reimbursements/employees/yearly/official/holidays/`).then(result => {
            if (result) {
                if (result.status === 200) {     
                    setHolidaysList(result.data)
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
    const deleteHolidays = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Holiday!",
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
                Api.deleteData(`/reimbursements/employees/yearly/official/holidays/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Holiday Deleted!',
                            text: 'Holiday is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                             getHolidays()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Holiday can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Holiday is not deleted.',
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
    getHolidays()
    setShow(false)
  }
    useEffect(() => {
        getHolidays()
      }, [setHolidaysList])
  return (
    <Fragment>
    <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    <Row className='mb-2'>
                        <Col md={6}>
                            <h3>Official Holidays</h3>
                        </Col>
                        <Col md={6}>
                            <Button className='btn btn-success float-right ' 
                             onClick={() => {
                                setModalType('Add New')
                                setShow(true)
                                }}
                            >
                                    Add Holiday
                            </Button>
                        </Col>
                    </Row>
                    <Table responsive bordered striped>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>
                                    Title
                                </th>
                                <th>
                                   Date
                                </th>
                                <th>
                                   Description
                                </th>
                                <th>
                                   Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                Object.values(HolidaysList).length > 0 ? (
                                    HolidaysList.map((item, key) => (
                                        item.is_active ? (
                                          <tr key={key}>
                                            <td>{item.title ? item.title : 'N/A'}</td>
                                            <td>{item.date ? item.date : 'N/A'}</td>
                                            <td>{item.description ? item.description : 'N/A'}</td>
                                            <td>
                                              <button
                                                className="border-0 no-background"
                                                title="Edit"
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setModalType('Edit')
                                                    setCurrentHoliday(item)
                                                    setShow(true)
                                                }} 
                                              >
                                                <Edit color="orange" />
                                              </button>
                                              <button
                                                className="border-0 no-background"
                                                title="Delete"
                                                onClick={() => deleteHolidays(item.id)}
                                              >
                                                <Trash2 color="red" />
                                              </button>
                                            </td>
                                          </tr>
                                        ) : null
                                      ))
                                      
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center'> No Holiday Found</td>
                                        </tr>
                                    )
                            ) : (
                                <tr>
                                    <td colSpan={4} className='text-center'> <Spinner color='primary'/></td>
                                </tr>
                            )
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
                
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
            <h1>{modalType} Official Holiday</h1>
          </div>
          {modalType === 'Add New' && (
            <AddHoliday CallBack={CallBack} DiscardModal={DiscardModal}/>
          ) }  
           {modalType === 'Edit' && (
            <UpdateHoliday holiday={currentHoliday} CallBack={CallBack} DiscardModal={DiscardModal}/>
          )}    
        </ModalBody>
      </Modal>
  </Fragment>
  )
}

export default View_Holiday