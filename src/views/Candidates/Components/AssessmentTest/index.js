import { useEffect, useState, useRef } from "react"
import { Card, CardBody, Label, Input, Spinner, CardTitle } from "reactstrap"
import {useParams} from "react-router-dom" 
import apiHelper from "../../../Helpers/ApiHelper"
const AssessmentTest = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [url_params] = useState(useParams())
    const [timer, setTimer] = useState(0)
    const [start, setStart] = useState(false)
    const firstStart = useRef(true)
    const tick = useRef() 
    const [data, setData] = useState([])
    const [is_last_question, set_is_last_question] = useState(false)
    const [answer_state, setAnswerState] = useState('')
    const [result, setResult] = useState('')
    const StartTest = async () => {
        setLoading(true)
        const url = `${process.env.REACT_APP_API_URL}/assessments/candidate/assessment/test/${url_params.uuid}/`
       await fetch(url, {
            method: 'GET',
            headers: { "Content-Type": "Application/json"}
        })
        .then((response) => response.json())
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    if (!final.is_result) {
                        setData(final)
                        final.is_last_question ? set_is_last_question(final.is_last_question) : set_is_last_question(false)
                        if (final.question.time) {
                            setTimer(final.question.time)
                            setStart(true)
                        } else {
                            setTimer(0)
                            setStart(false)
                        } 
                    } else {
                        setData([])
                        set_is_last_question(false)
                        setResult(postFinal.result)
                    }
                    
                } else {
                    setData([])
                    set_is_last_question(false)
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Something Went Wrong!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
  
    const onNext = () => {
        setStart(false)
        setTimer(0)
        const nxtformData = new FormData()
        if (answer_state === '') {
            setAnswerState({question: data.question.id, answer_option: null, answer: null})
            nxtformData['question'] = data.question.id
            nxtformData['answer_option'] = null
            nxtformData['answer'] = null
        } else {
            nxtformData['question'] = answer_state.question
            nxtformData['answer_option'] = answer_state.answer_option
            nxtformData['answer'] = answer_state.answer
        }
        setLoading(true)
        
        
        fetch(`${process.env.REACT_APP_API_URL}/assessments/candidate/assessment/test/${url_params.uuid}/`, {
            method: 'POST',
            headers: {
            'content-type' : 'application/json'
            },
            body: JSON.stringify(nxtformData)
        })
        .then((response) => response.json())
        .then(postResult => {
            if (postResult) {
                if (postResult.status === 200) {
                    const postFinal = postResult.data
                    if (!postFinal.is_result) {
                        setData(postFinal)
                        postFinal.is_last_question ? set_is_last_question(postFinal.is_last_question) : set_is_last_question(false)
                        if (postFinal.question.time) {
                            setTimer(postFinal.question.time)
                            setStart(true)
                        } else {
                            setTimer(0)
                            setStart(false)
                        } 
                    } else {
                        setData([])
                        set_is_last_question(false)
                        setResult(postFinal.result)
                    }
                    setAnswerState('')
                } else {
                    setData([])
                    set_is_last_question(false)
                }
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    
    useEffect(() => {
        if (firstStart.current) {
          firstStart.current = !firstStart.current
          return
        }
    
        // console.log("subsequent renders")
        // console.log(start)
        if (start) {
          tick.current = setInterval(() => {
            setTimer((timer) => timer - 1)
          }, 1000)
        } else {
          console.log("clear interval")
          clearInterval(tick.current)
        }
    
        return () => clearInterval(tick.current)
      }, [start])
      const getPercentage = (mark, total) => {
        const final = (mark / total) * 100
        return final
      }
    const dispSecondsAsMins = (seconds) => {
    // 25:00
    const mins = Math.floor(seconds / 60)
    const seconds_ = seconds % 60
    // if (mins === 0 && seconds_ === 0) {
    //   onNext()
    // }
    return (mins === 0 && seconds_ === 0) ? onNext() : `${mins === 0 ? '00' : mins.toString()}:${seconds_ === 0 ? '00' : seconds_.toString()}` 
    }  
    useEffect(() => {
        StartTest()
    }, [])
  return (
    <div className="container">
        
     {result === '' ? (
        <>
            <div className="row my-1">
                
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <h2 className="text-center">Assessment Test</h2>
                </div>
                <div className="col-lg-4">
                    <span className="float-right">Time: <strong>{start ? dispSecondsAsMins(timer) : '00:00'}</strong></span>
                </div>
            
            </div>
            <hr></hr>
            <Card className="p-1">
            <CardBody>
            {!loading ? (
                Object.values(data).length > 0 ? (
                <>
                    <h3 className="mb-3">{data.question.question}</h3>
                        {Object.values(data.question.question_options).map((option, optionKey) => (
                            <div className='form-check mb-1' key={optionKey}>
                            <Input type='radio' name='ex1' value={option.value} onChange={e => setAnswerState({question: data.question.id, answer_option: (optionKey + 1), answer: e.target.value})}/>
                            <Label className='form-check-label' for='ex1-active'>
                                <strong>{option.value}</strong>
                            </Label>
                        </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center">
                        <p>No Data Found</p>
                    </div>
                )
            ) : (
                    <div className="text-center">
                        <Spinner />
                    </div>
            )
            
            }            
                    
            {!is_last_question ? <button className="float-right btn btn-warning" onClick={onNext}>Next</button> : <button className="float-right btn btn-success" onClick={onNext}>Finish</button>}
            </CardBody>
            </Card>
        </>
     ) : (
        <>
        {/* {getPercentage(result.correct_questions, result.total_questions) > 50 ? ( */}
        <div className="row my-1">
                
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <h2 className="text-center">Assessment Test Result</h2>
                </div>
                <div className="col-lg-4">
                </div>
            
            </div>
            <hr></hr>
        <Card>
            <CardBody>
                <h3>Thanks for your interest.</h3>
                <h2 className="mt-1">You have achieved {getPercentage(result.correct_questions, result.total_questions)}%.</h2>
                {getPercentage(result.correct_questions, result.total_questions) ? <p className="mt-1">Our HR official will contact you soon.</p> : <p className="mt-1">Better luck next time!</p>}
            </CardBody>
        </Card>
        {/* ) : {

        }} */}
        
        {/* <h1>Correct Question: {result.correct_questions}</h1> */}
        </>
     )}       
    </div>
  )
}

export default AssessmentTest