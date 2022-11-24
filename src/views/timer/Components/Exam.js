import { useEffect, useRef, useState } from "react"

/**
 * https://stackoverflow.com/questions/68844258/how-to-start-and-stop-timer-display-in-reactjs
 */

const Exam = () => {
  const [timer, setTimer] = useState(100) // 25 minutes
  const [start, setStart] = useState(false)
  const firstStart = useRef(true)
  const tick = useRef()

  useEffect(() => {
    if (firstStart.current) {
      console.log("first render, don't run useEffect for timer")
      firstStart.current = !firstStart.current
      return
    }

    console.log("subsequent renders")
    console.log(start)
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

  const dispSecondsAsMins = (seconds) => {
    // 25:00
    console.log(`seconds ${seconds}`)
    const mins = Math.floor(seconds / 60)
    const seconds_ = seconds % 60
    
    return (mins === 0 && seconds_ === 0) || (mins < 0 && seconds_ < 0) ? 'Time is up' : `${mins === 0 ? '00' : mins.toString()}:${seconds_ === 0 ? '00' : seconds_.toString()}` 
  }

  return (
    <div className="Exam">
      <ul>
      </ul>
      <h1>{dispSecondsAsMins(timer)}</h1>
      <div className="startDiv">
        {/* event handler onClick is function not function call */}
        <button className="startBut" onClick={toggleStart}>
          {!start ? "START" : "STOP"}
        </button>
        {/* {start && <AiFillFastForward className="ff" onClick="" />} */}
      </div>
    </div>
  )
}

export default Exam
