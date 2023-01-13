import { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Input, CardTitle, Spinner, Badge } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import CancelEvaluation from './EvaluationActions/CancelEvaluation'

const EvaluationForm = ({uuid, stage_id}) => {
    const Api = apiHelper()
    const [evaluationData, setEvaluationData] = useState([])
    const [evaluations] = useState([])
    const [evaluationStatus, setEvaluationStatus] = useState([])
    const [evaluationForm, setEvaluationForm] = useState([])
    const [loading, setLoading] = useState(false)
    const [answers] = useState([])
    const [recommendation, setRecommendation] = useState('')
    const [comment, setComments] = useState('')
    const [canvasCancelPlacement, setCanvasCancelPlacement] = useState('end')
    const [canvasCancelOpen, setCanvasCancelOpen] = useState(false)
    const [currentEvaluationId, setCurrentEvaluationId] = useState(null)

    const getEvaluationData = async () => {
        setLoading(true)
        await Api.get(`/evaluations/candidate/job/get/by/stage/${uuid}/${stage_id}/`).then(result => {
            if (result) {
                setEvaluationData([])
                if (result.status === 200) {
                    const data = result.data
                   setEvaluationData(data)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/evaluations/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    if (final.length > 0) {
                        evaluations.splice(0, evaluations.length)
                        for (let i = 0; i < final.length; i++) {
                            evaluations.push({value: final[i].id, label: final[i].title})
                        }
                    }
                } else {
                    // Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const getEvaluationStatus =  async (evaluation) => {
        setLoading(true)
        const formData = new FormData()
        formData['stage'] = stage_id
        formData['evaluation'] = evaluation
        await Api.jsonPost(`/evaluations/candidate/job/set/${uuid}/`, formData)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    console.warn(result.data)
                    setEvaluationStatus(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const onStartEvaluation = async (id) => {
        setLoading(true)
        await Api.get(`/evaluations/candidate/job/start/${uuid}/${id}/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    console.warn(result.data)
                    setEvaluationForm(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const toggleCancelCanvas = (id) => {
        if (id) {
            setCurrentEvaluationId(id)
        }
        setCanvasCancelPlacement('end')
        setCanvasCancelOpen(!canvasCancelOpen)
        // CallBack()
      }
    const CancelCallBack = () => {
        setCanvasCancelOpen(false)
        getEvaluationData()
    }  
    const onChangeAnswer = (id, score) => {
        console.warn(id)
        if (Object.values(answers).length > 0) {
            const valueGroupIdx = answers.findIndex(el => el.id === id)
            
            if (valueGroupIdx > -1) {
                answers[valueGroupIdx].score = score
            } else {
                answers.push({id, score})
            }
        } else {
            answers.push({id, score})
        }
        return answers
    }
    const OnSubmitEvaluation = async (id) => {
        setLoading(true)
        if (Object.values(answers).length > 0 && recommendation !== ''
        && comment !== '') {
            const formData = new FormData()
            formData['evaluation_questions_remarks'] = answers
            formData['recommendation'] = recommendation
            formData['comment'] = comment
            await Api.jsonPost(`/evaluations/candidate/job/submit/questions/remarks/${uuid}/${id}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        setEvaluationForm([])
                        setEvaluationStatus([])
                        getEvaluationData()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
        } else {
            Api.Toast('error', 'All fields are required')
        }
        
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getEvaluationData()
        getPreData()
    }, [])
  return (
    <Fragment>
         {!loading ? (
            Object.values(evaluationForm).length > 0 ? (
                <div className='row'>
                        <div className='col-lg-12 mb-1'>
                            <Card>
                                <CardTitle>
                                    <h2>{evaluationForm.candidate_evaluation.evaluation_title}</h2>
                                </CardTitle>
                                <CardBody>
                                    {evaluationForm.evaluation_questions.map((data, index) => (
                                        <>
                                        <h3>{data.question}</h3>
                                        <div className='demo-inline-spacing evaluationForm' key={index}>
                                        <div className='form-check form-check-primary'>
                                            <Input type='radio' id='radio-primary' name={`question-${data.id}`} onChange={() => onChangeAnswer(data.id, 4)} />
                                            <Label className='form-check-label' for='radio-primary'>
                                            Excellent
                                            </Label>
                                        </div>
                                        <div className='form-check form-check-success'>
                                            <Input type='radio' id='radio-success' name={`question-${data.id}`} onChange={() => onChangeAnswer(data.id, 3)}/>
                                            <Label className='form-check-label' for='radio-success'>
                                            Good
                                            </Label>
                                        </div>
                                        <div className='form-check form-check-warning'>
                                            <Input type='radio' id='radio-warning' name={`question-${data.id}`} onChange={() => onChangeAnswer(data.id, 2)}/>
                                            <Label className='form-check-label' for='radio-warning'>
                                            Average
                                            </Label>
                                        </div>
                                        <div className='form-check form-check-danger'>
                                            <Input type='radio' id='radio-danger' name={`question-${data.id}`} onChange={() => onChangeAnswer(data.id, 1)}/>
                                            <Label className='form-check-label' for='radio-danger'>
                                            Bad
                                            </Label>
                                        </div>
                                        
                                        </div>
                                        </>
                                    )) }
                                    
                                </CardBody>
                            </Card>
                    </div> 
                    <div className='col-lg-12'>
                        <Label>
                            Recommendation<Badge color='red'>*</Badge>
                        </Label>
                        <Input 
                        type='textarea'
                        className='form-control'
                        placeholder='Recommendations'
                        onChange={e => setRecommendation(e.target.value)}
                        />
                    </div>
                    <div className='col-lg-12'>
                    <Label>
                            Comments<Badge color='red'>*</Badge>
                        </Label>
                        <Input 
                        type='textarea'
                        className='form-control'
                        placeholder='Comments'
                        onChange={e => setComments(e.target.value)}
                        />
                    </div>
                    <div className='col-lg-12 text-center mt-2'>
                        <Button className='btn btn-primary' onClick={() => OnSubmitEvaluation(evaluationForm.candidate_evaluation.id)}>
                                Submit
                        </Button>
                    </div>
                </div>
                    
            ) : (
                Object.values(evaluationStatus).length > 0 ? (
                    <div className='row'>
                            <div className='col-lg-6 text-center'>
                                <Button className='btn btn-primary' onClick={() => onStartEvaluation(evaluationStatus.id)}>
                                    Start Evaluation
                                </Button>
                            </div>
                            <div className='col-lg-6 text-center'>
                                <Button className='btn btn-danger' onClick={() => toggleCancelCanvas(evaluationStatus.id)}>
                                    Cancel Evaluation
                                </Button>
                            </div>
                        </div>
                ) : (
                    Object.values(evaluationData).length > 0 ? (
                        <>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <h3>{evaluationData.evaluation_title}</h3>
                                <p>by</p>
                                <h3>{evaluationData.evaluated_by_name}</h3>
                            </div>

                            <div className='col-lg-8'>
                                {evaluationData.is_completed ? (
                                    evaluationData.evaluation_questions.length > 0 && (
                                        <>
                                        <h3>Scoreboard</h3>
                                        {evaluationData.evaluation_questions.map((data, index) => (
                                            <div className='row'>
                                                <Card key={index}>
                                                    <CardBody>
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                <p>{index + 1} - {data.question}</p>
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <Badge>score</Badge> <b>{data.score}</b>
                                                            </div>
                                                        </div>
                                                        
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        ))}
                                        <Label>
                                            Recommendation
                                        </Label>
                                        <p><b>{evaluationData.recommendation}</b></p>
                                        <Label>
                                            Comments
                                        </Label>
                                        <p><b>{evaluationData.comment}</b></p>
                                        </>
                                    )
                                ) : (
                                    <div className='row'>
                                        <div className='col-lg-6 text-center'>
                                            <Button className='btn btn-primary' onClick={() => onStartEvaluation(evaluationData.id)}>
                                                Start Evaluation
                                            </Button>
                                        </div>
                                        <div className='col-lg-6 text-center'>
                                            <Button className='btn btn-danger' onClick={() => toggleCancelCanvas(evaluationData.id)}>
                                                Cancel Evaluation
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                        </>
                    ) : (
                        <>
                            <Form>
                                <div className='row'>
                                    <div className='col-lg-6 mb-1'>
                                        <Label>
                                            Evaluation Form<Badge color='light-danger'>*</Badge>
                                        </Label>
                                        <Select
                                            type="text"
                                            name="evaluations"
                                            options={evaluations}
                                            onChange={ (e) => getEvaluationStatus(e.value)}
                                        />
                                    </div>
                                </div> 
                            </Form>
                        </>
                    )
                )
            )
            
         ) : (
            <div className="text-center"><Spinner color='primary'/></div>
         )}
         <Offcanvas direction={canvasCancelPlacement} isOpen={canvasCancelOpen} toggle={toggleCancelCanvas} className="Interview-Form-Canvas">
          <OffcanvasHeader toggle={toggleCancelCanvas}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <CancelEvaluation uuid={uuid} evaluationID={currentEvaluationId} CallBack={CancelCallBack}/>
          </OffcanvasBody>
        </Offcanvas>
        
    </Fragment>
    
  )
}

export default EvaluationForm