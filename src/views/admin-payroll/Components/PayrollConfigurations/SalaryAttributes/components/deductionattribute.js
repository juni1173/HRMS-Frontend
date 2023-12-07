// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2, Edit, ChevronsDown, ChevronsUp} from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardTitle, CardSubtitle, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table, Modal, ModalBody, ModalHeader, Collapse } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import UpdateAttribute from './updateattributes'

const DeductionAttributes = ({callBack}) => {
    const Api = apiHelper()
    const [show, setShow] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [currentAttribute, setCurrentAttribute] = useState()
    const DiscardModal = () => {
        setShow(false)
      }
      const handleModalClosed = () => {
        // setModalType('Add New')
        setShow(false)
      }

  // ** State
  const [loading, setLoading] = useState(false)
  const [payrollattributesdata, setpayrollattributesdata] = useState([])

  const getData =  async () => {
    setLoading(true)
        await Api.get(`/payroll/deduction/attributes`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setpayrollattributesdata(result.data) 
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
  }
  const removePayrollAttribute = id => {
    if (id) {
        setLoading(true)
        Api.deleteData(`/payroll/addons/attributes/${id}/`, {method: 'Delete'}).then(result => {
            if (result) {
                if (result.status === 200) {
                getData()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
    setTimeout(() => {
        setLoading(false)
    }, 1000)
    } 
  }
  // useEffect(() => {
  //   getData()
  // }, [setpayrollattributesdata])
  useEffect(() => {
    if (callBack) {
      getData()
    }
  }, [callBack])
  const handleCallBack = () => {
    getData()
  }
  return (
    <Fragment>
        {!loading ? (
            <>


                        {/* ADDON ATTRIBUTES */}
                        {/* <Card className='gx-0'> */}
                            {/* <CardBody> */}
                            <Card>
  <CardBody>
    <Row>
      <Col xs="8">
        <h2 className='text-dark'>Deduction Attributes</h2>
      </Col>
      <Col xs="4">
        <button
          className="border-0 no-background float-right"
          title={showContent ? "Hide" : "Show"}
          onClick={() => setShowContent(!showContent)}
        >
          {showContent ? <ChevronsUp color="blue" /> : <ChevronsDown color="blue" />}
        </button>
      </Col>
    </Row>
  </CardBody>
</Card>

        <Collapse isOpen = {showContent}>
                            {payrollattributesdata.length > 0 ? (
                              <>
                              {payrollattributesdata.map((attribute) => (                     
                                <Card key={attribute.id}>
 <CardBody>
     <div className="row">
         <div className="col-md-4">
         <CardTitle tag='h1'>{attribute.title}</CardTitle>
         <CardSubtitle><Badge color='light-warning'>
         {`${attribute.is_employee_base  ? 'Employee Base' : 'Organization Base'}`}
             </Badge></CardSubtitle>
         </div>
         {/* <div className="col-md-3">
             <Badge color='light-info'>
                    {attribute.is_Taxable ? 'Taxable' : 'Non Taxable'}
             </Badge>
         </div> */}
         <div className="col-md-4">
             <Badge color='light-success'>
                 {attribute.valueTypeChoices_title}
             </Badge>
             
         </div>
         <div className="col-lg-4 float-right">
             
             <div className="float-right">
                 <button
                     className="border-0 no-background"
                     title="Edit"
                     onClick={() => {
                        setCurrentAttribute(attribute)
                        setShow(true)
                      }}
                     >
                     <Edit color="orange"/>
                 </button>
                 <button
                     className="border-0 no-background"
                     title="Delete"
                     onClick={() => removePayrollAttribute(attribute.id)}
                     >
                     <Trash2 color="red"/>
                 </button>
             </div>
         </div>
     </div>       
 </CardBody>
 </Card> 
 
                              ))}
                            </>
                        
                               
                            ) : (
                                <>
                                <p>No Attributes Data !</p>
                                <hr></hr>
                                </>
                            )}
                            </Collapse>                     
                          
                
            </>
        ) : (
            <div className='text-center'><Spinner type='grow' color='white'/></div>
        )}
           <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1> Update Deduction Attribute</h1>
          </div>     
            <UpdateAttribute attribute={currentAttribute} CallBack={handleCallBack} DiscardModal={DiscardModal}/>    
        </ModalBody>
      </Modal>
    </Fragment>
    
  )
}

export default DeductionAttributes
