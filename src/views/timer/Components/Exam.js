import { useEffect, useRef, useState } from "react"
import { Card, CardBody, Label, Input, Form } from "reactstrap"

/**
 * https://stackoverflow.com/questions/68844258/how-to-start-and-stop-timer-display-in-reactjs
 */

const Exam = () => {
    
  const [timer, setTimer] = useState(5) // 25 minutes
  const [start, setStart] = useState(false)
  const firstStart = useRef(true)
  const tick = useRef()
  const [questionsArr] = useState([{id: 1, question: 'First Question', op1: 'option1', op2: 'option2', op3: 'option3', op4: 'option4', Answer: 'op2'}, {id: 2, question: 'Second Question', op1: 'option1', op2: 'option2', op3: 'option3', op4: 'option4', Answer: 'op3'}])
  const [answer, setAnswer] = useState(null)
//   const [currentQuestion, setCurrentQ] = useState(1)
  const onChangeValue = event => {
    setAnswer(event.target.value)
 
  }

//   const onNext = (currentQuestion) => {
//     if (currentQuestion !== 10) {
//         setCurrentQ(currentQuestion + 1)
//     }
//   }
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

  const toggleStart = () => {
    setStart(!start)
  }
  const onNext = () => {
    
      console.warn(answer)
      return false
  }
  const dispSecondsAsMins = (seconds) => {
    // 25:00
    const mins = Math.floor(seconds / 60)
    const seconds_ = seconds % 60
    if (mins === 0 && seconds_ === 0) {
      onNext()
    }
    return (mins === 0 && seconds_ === 0) ? 'Time is up' : `${mins === 0 ? '00' : mins.toString()}:${seconds_ === 0 ? '00' : seconds_.toString()}` 
  }
 

  return (
    <div className="container">
        <div className="Exam">
        <ul>
        </ul>
        <h1 className="text-center">Time: {start ? dispSecondsAsMins(timer) : '00:00'}</h1>
        <div className="startDiv">
            {/* event handler onClick is function not function call */}
            <button className="startBut" onClick={toggleStart}>
            {!start ? "START" : "STOP"}
            </button>
            {/* {start && <AiFillFastForward className="ff" onClick="" />} */}
            
        </div>
        </div>
        <div>
            {Object.values(questionsArr).map((item, key) => (
                <>
                <Card className="p-1">
                    <CardBody key={key}>
                        <h3 className="mb-3">{key + 1}. {item.question}</h3>
                            <div className=''>
                                <div className='form-check mb-1'>
                                    <Input type='radio' name='ex1' value={item.op1} onChange={onChangeValue}/>
                                    <Label className='form-check-label' for='ex1-active'>
                                        <strong>{item.op1}</strong>
                                    </Label>
                                </div>
                                <div className='form-check mb-1'>
                                    <Input type='radio' name='ex1' value={item.op2} onChange={onChangeValue}/>
                                    <Label className='form-check-label' for='ex1-active'>
                                        <strong>{item.op2}</strong>
                                    </Label>
                                </div>
                                <div className='form-check mb-1'>
                                    <Input type='radio' name='ex1' value={item.op3} onChange={onChangeValue}/>
                                    <Label className='form-check-label' for='ex1-active'>
                                        <strong>{item.op3}</strong>
                                    </Label>
                                </div>
                                <div className='form-check mb-1'>
                                    <Input type='radio' name='ex1' value={item.op4} onChange={onChangeValue}/>
                                    <Label className='form-check-label' for='ex1-active'>
                                        <strong>{item.op4}</strong>
                                    </Label>
                                </div>
                            </div>
                        <button className="float-right btn btn-success" onClick={onNext}>Next</button>
                    </CardBody>
                </Card>
                </>
            ))}
        </div>
    </div>
  )
}

export default Exam
