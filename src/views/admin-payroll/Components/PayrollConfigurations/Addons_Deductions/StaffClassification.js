import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader } from "reactstrap" 
import { Edit2, Save, Users, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import UpdateStaffClassification from './update_staff_classification'
const Staffclassification = ({content}) => {
    const Api = apiHelper() 
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [staffdropdown, setstaffdropdown] = useState([])
    const [show, setShow] = useState(false)
    const [currentitem, setcurrentitem] = useState()
   const DiscardModal = () => {
    setShow(false)
  }
  const handleModalClosed = () => {
    // setModalType('Add New')
    setShow(false)
  }
    const getData = async () => {
      await Api.get(`/organizations/staff_classification/`).then(response => {
        if (response.status === 200) {            
          setstaffdropdown([])
    // // Populate the staffdropdown array with new data
    const newStaffDropdown = response.data.map(item => ({
    value: item.id,
    label: item.title
    }))
    
    // Set the staffdropdown state with the new data
    setstaffdropdown(newStaffDropdown)
    setLoading(false)
      } else {
          Api.Toast('error', response.message)
          setLoading(false)
      }  
      }) 
      if (content) { 
      setLoading(true)
    const formdata = new FormData()
    formdata['payroll_attribute'] = content.payroll_attribute
    formdata['payroll_batch'] = content.payroll_batch
    const response = await Api.jsonPost(`/payroll/monthly/distribution/view/`, formdata)
    if (response.status === 200) {
      setData(response.data)
      setLoading(false) 
  } else {
      Api.Toast('error', response.message)
      setLoading(false)
  }
 
    // const scresponse = await Api.get('/organizations/staff_classification/')
    //     if (scresponse.status === 200) {            
    //         setstaffdropdown([])
    // // // Populate the staffdropdown array with new data
    // const newStaffDropdown = scresponse.data.map(item => ({
    //   value: item.id,
    //   label: item.title
    // }))

    // // Set the staffdropdown state with the new data
    // setstaffdropdown(newStaffDropdown)
    // setLoading(false)
    //     } else {
    //         Api.Toast('error', scresponse.message)
    //         setLoading(false)
    //     }  

        setTimeout(() => {
          setLoading(false)
         }, 2000)
      }
        }
      useEffect(() => {
getData()
      }, [])
      const CallBack = () => {
        getData()
      }
      return (
<Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Staff Classification</h5>
        </div>
        {!loading ? <>
        {Object.values(data).length > 0 ? (
                    <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Staff Classification
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                         Amount
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.staff_classification_title}</td>
                                                <td>{item.amount}</td>
                                                <td>
                                                    <div className="d-flex row">
                                                    <div className="col">
                                                        <button
                                                        className="border-0"
                                                        onClick={() => {
                                                            setcurrentitem(item)
                                                            setShow(true)
                                                          }}
                                                        >
                                                        <Edit2 color="orange" />
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
                            <div className="text-center">No Data Found!</div>
                        )} </> : <div className='text-center'><Spinner type='grow' color='blue'/></div>}
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
            <h1> Update Staff Classification</h1>
          </div>     
            <UpdateStaffClassification staffclassification={currentitem} dropdown={staffdropdown} CallBack={CallBack} DiscardModal={DiscardModal} payroll_attribute={content.payroll_attribute} payroll_batch={content.payroll_batch}/>    
        </ModalBody>
      </Modal>
    </Fragment>
      )
}
export default Staffclassification