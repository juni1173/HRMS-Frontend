import { Fragment, useState } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Spinner, Input, Label, Badge, Button } from "reactstrap" 
import { Edit, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Leave = ({ data, status_choices, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const onStatusUpdate = async (id, status_value, comment) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to update the Status!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['status'] = status_value
                if (comment !== '') formData['decision_reason'] = comment
                 Api.jsonPatch(`/reimbursements/update/leaves/status/${id}/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Status Updated!',
                                text: 'Status is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(async function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    await CallBack()
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 1000)
                                }
                            })
                            } else {
                                MySwal.fire({
                                    title: 'Error',
                                    text: result.message ? result.message : 'Something went wrong',
                                    icon: 'error',
                                    customClass: {
                                      confirmButton: 'btn btn-success'
                                    }
                                  })
                            }
                    })
            } 
        })
    }
    const StatusComponent = ({ item, index }) => {
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [comment, setComment] = useState('')
    const [statusValue, setStatusValue] = useState('')
   
    return (
        <div className="single-history" key={index}>
        
        {toggleThisElement ? (
            <div className="row min-width-300">
            <div className="col-lg-8">
            <Select
                isClearable={false}
                options={status_choices}
                className='react-select mb-1'
                classNamePrefix='select'
                defaultValue={status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status) : status_choices[0] }
                onChange={(statusData) => setStatusValue(statusData.value)}
                />
                {((statusValue === 'not-approved') || (statusValue === 'approved')) && (
                    <>
                    <Label>
                    Comment
                </Label>
                <Input 
                    type='textarea'
                    className='mb-1'
                    name='commentText'
                    placeholder="Add Remarks"
                    onChange={ (e) => { setComment(e.target.value) }}
                />
                </>
                ) 
                }
                
                <Button className="btn btn-primary" onClick={ async () => {
                    await onStatusUpdate(item.id, statusValue, comment).then(() => {
                        setToggleThisElement((prev) => !prev)
                    })
                }}>
                    Submit
                </Button>
            </div>
            <div className="col-lg-4 float-right">
            <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
            </div>
        </div>
        ) : (
            <div className="row min-width-225">
                <div className="col-lg-8">
                <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status).label : status_choices[0].label }</Badge></h3>
                </div>
                
                <div className="col-lg-4 float-right">
                    <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                 </div>
            </div>
        )
            
        }
        </div>
    )
    }
  return (
    <Fragment>
    <Row>
        <Col md={12}>
     <div className='content-header' >
      <h5 className='mb-2'>Leave Requests</h5>
    </div>
    
    {!loading ? (
            <>
        {(data && Object.values(data).length > 0) ? (
            <Row>
             <Col md={12}>
             {Object.values(data).map((item, index) => (
                        <Card key={index}>
                        <CardBody>
                            <div className="row">
                               
                                <div className="col-md-4">
                                <CardTitle tag='h1'>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</CardTitle>
                                <CardSubtitle>
                                <h4><Badge color='light-success'>{item.staff_classification_title ? item.staff_classification_title : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    <h4><Badge color='light-warning'>{`${item.end_date ? item.end_date : <Badge color='light-danger'>N/A</Badge>} - ${item.start_date ? item.start_date : <Badge color='light-danger'>N/A</Badge>}`}</Badge></h4></CardSubtitle>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-success'>
                                            Type
                                    </Badge><br></br>
                                    <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.leave_types_title && item.leave_types_title}</span>
                                    
                                    <br></br><Badge color='light-danger'>
                                        Duration
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.duration && item.duration}</span>
                                </div>
                                <div className="col-md-4">
                                <div className="mb-1">
                                    <StatusComponent item={item} key={index}/>
                                    </div>
                                <Badge color='light-success'>
                                Allowed
                                    </Badge><br></br>
                                    <h4><Badge color='light-danger'>{item.allowed_leaves ? item.allowed_leaves : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    
                                </div>
                               
                            </div>
                                
                        </CardBody>
                        </Card> 
                    ))}
                </Col>   
        </Row>
        ) : (
            <div className="text-center">No Gym Allowance Request Data Found!</div>
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

export default Leave