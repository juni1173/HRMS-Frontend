import { Fragment, useState } from 'react'
import { Row, Col, Spinner, Button, Card, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, CardBody } from "reactstrap" 
import { DollarSign, Eye, Upload } from 'react-feather'
import TrainingDetails from './TrainingDetails'
import Assignments from './Assignments'
import TrainingReimbursement from './TrainingReimbursement'
import EvaluateAssignments from './EvaluateAssignments'
const TrainingList = ({ data, CallBack, is_project_base, is_evaluate }) => {
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [loading] = useState(false)
    const [detailData, setDetailData] = useState([])
    const [toggleType, setToggleType] = useState('')
    const toggleCanvasEnd = (itemData, type) => {
        if (type) {
            setToggleType(type)
        } else {
            setToggleType('')
        }
        if (itemData) setDetailData(itemData)
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        }
    const runCallback = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        CallBack()
    }
  return (
    <Fragment>
        <Row>
            <Col md={12}>
                {!loading ? (
                        <>
                    {(data && Object.values(data).length > 0) ? (
                        <Row>
                            {Object.values(data).map((item, key) => (
                                <Col md={6} key={key}>
                                    <Card className="dark-shadow">
                                        <CardBody>
                                        <div className="row">
                                            
                                            <div className="col-md-6">
                                            <h3>{item.training_title ? item.training_title : (item.title ? item.title : 'N/A')}</h3>
                                                <Badge color='light-warning'>
                                                    {`${item.mode_of_training_title ? item.mode_of_training_title : 'N/A'}`} 
                                                </Badge><br></br>
                                                <Badge color='light-danger'>
                                                    {`${item.training_status_title ? item.training_status_title : 'No Status'}`} 
                                                </Badge>
                                                
                                                {!is_project_base ?   <>
                                                {(item.training_status === 3 && item.mode_of_training !== 2) && (
                                                    <button
                                                        className="btn border-0 btn-success float-right"
                                                        title="Reimbursement"
                                                        onClick={() => toggleCanvasEnd(item, 'reimbursement')}
                                                        style={{ fontSize: '12px' }}
                                                        >
                                                        Reimbursement
                                                    </button>
                                                )}
                                                </> : null}
                                                
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div className='float-right'>
                                                    <button
                                                        className="border-0 no-background"
                                                        title="View"
                                                        onClick={() => toggleCanvasEnd(item, 'view')}
                                                        >
                                                        <Eye color="green"/>
                                                    </button><br></br>
                                                    <Row>
                                                    {(item.training_status === 2 || item.training_status === 3) && (
                                                        <>
                                                            <button
                                                                className="btn border-0 btn-warning mt-1 float-right"
                                                                title="Assignments"
                                                                onClick={() => toggleCanvasEnd(item, 'assignments')}
                                                                style={{ fontSize: '12px' }}
                                                                >
                                                                    Assignments
                                                            </button>
                                                        </>
                                                        
                                                    )}
                                                    {(is_evaluate) && (
                                                        <>
                                                            <button
                                                                className="btn border-0 btn-success mt-1 btn-sm"
                                                                title="Evaluate Assignments"
                                                                onClick={() => toggleCanvasEnd(item.training_employees, 'evaluate_assignments')}
                                                                style={{ fontSize: '12px' }}
                                                                >
                                                                   Evaluate Assignments
                                                            </button>
                                                        </>
                                                        
                                                    )}
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                        </CardBody>
                                    </Card>
                                </Col>    
                            )
                            )}
                        </Row>
                    ) : (
                        <p className='text-white'>Data not found!</p>
                    )
                    
                    }
                        </>
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )  
                }
            </Col>
        </Row>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
            {toggleType === 'view' && (
                <TrainingDetails data={detailData} CallBack={runCallback} is_project_base={is_project_base}/>
            )}
            {toggleType === 'assignments' && (
                <Assignments data={detailData} CallBack={runCallback} is_project_base={is_project_base}/>
            )}
            {toggleType === 'evaluate_assignments' && (
                <EvaluateAssignments data={detailData} CallBack={runCallback}/>
            )}
            {toggleType === 'reimbursement' && (
                <TrainingReimbursement data={detailData} CallBack={runCallback}/>
            )}
            </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default TrainingList