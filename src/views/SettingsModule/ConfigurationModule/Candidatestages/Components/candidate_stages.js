import {useState, useEffect, Fragment} from 'react'
import { Edit } from 'react-feather'
import { Table, Row, Col, CardBody, Card, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import UpdateStage from './UpdateStage'

const candidate_stages = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [Stages] = useState([])
    const [StagesList, setStagesList] = useState([])
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const [updateStage, setUpdateStage] = useState([])

    const getStages = async () => {
        setLoading(true)
        await Api.get(`/stages/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const stages = result.data
                    setStagesList(stages)
                    Stages.splice(0, Stages.length)
                        Stages.splice(0, Stages.length)
                        for (let i = 0; i < Object.values(stages).length; i++) {
                            Stages.push({value: stages[i].id, label: stages[i].title})
                        }
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
    const toggleCanvasEnd = item => {
        setUpdateStage(item)
        setupdateCanvasPlacement('end')
        setupdateCanvasOpen(!updateCanvasOpen)
      }
    const CallBack = () => {
        setupdateCanvasOpen(false)
        getStages()
    }
    useEffect(() => {
        getStages()
      }, [setStagesList])
  return (
    <Fragment>
    <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    <Row className='mb-2'>
                        <Col md={6}>
                            <h3>Candidate Stages</h3>
                        </Col>
                        <Col md={6}>
                            {/* <Button className='btn btn-success float-right '>
                                    Add Stage
                            </Button> */}
                        </Col>
                    </Row>
                    <Table responsive bordered striped>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>
                                    Stage
                                </th>
                                <th>
                                    Email Template
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                Object.values(StagesList).length > 0 ? (
                                    StagesList.map((item, key) => (
                                        <tr key={key}>
                                            <td>{item.title ? item.title : 'N/A'}</td>
                                            <td>{item.email_template ? item.email_template : 'N/A'}</td>
                                            <td> <button
                                                    className="border-0 no-background "
                                                    title="Edit"
                                                    onClick={() => toggleCanvasEnd(item)}
                                                    >
                                                    <Edit color="orange"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className='text-center'> No Stage Found</td>
                                        </tr>
                                    )
                            ) : (
                                <tr>
                                    <td colSpan={3} className='text-center'> <Spinner color='primary'/></td>
                                </tr>
                            )
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
                
        </Col>
    </Row>
    <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
    <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
    <OffcanvasBody className=''>
        <UpdateStage data={updateStage} CallBack={() => CallBack()}/>
    </OffcanvasBody>
  </Offcanvas>
  </Fragment>
  )
}

export default candidate_stages