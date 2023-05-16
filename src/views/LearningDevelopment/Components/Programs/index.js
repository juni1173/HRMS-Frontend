import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddProgram from "./AddProgram"
import ProgramList from "./ProgramList"
import ProgramHelper from "../../../Helpers/LearningDevelopmentHelper/ProgramHelper"
import apiHelper from "../../../Helpers/ApiHelper"
const index = () => {
    const Helper = ProgramHelper()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [programList, setProgramList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchPrograms = async () => {
      setLoading(true)
      await Helper.fetchProgramList().then(result => {
          if (result) {
              setProgramList(result) 
          } else {
              setProgramList([])
          }
          
      })
      setTimeout(() => {
          setLoading(false)
      }, 1000)
      return false
  }
  
  const CallBack = () => {
      setCanvasOpen(false)  
      fetchPrograms()
  }
  useEffect(() => {
      fetchPrograms()
  }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
            </div>
            <div className="col-lg-6">
            {Api.role === 'admin' && (
                <button
                className="btn btn-sm btn-success float-right"
                title="Add Program"
                onClick={toggleCanvasEnd}
                >    
                <Plus />Add Program
            </button>
            )}
                
            </div>
        </div>
        {!loading ? (
        programList.length > 0 ? (
            <>
            <ProgramList data={programList} CallBack={CallBack} />
            {/* {programList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchPrograms}/>
              })} */}
            </>
          ) : (
            <Card>
                <CardBody>
                    <p>No Programs Data Found...</p>
                </CardBody>
            </Card>
          )
      ) : (
        <div className="text-center"> <Spinner/></div>
      )
      }
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
              <AddProgram CallBack={CallBack}/>
            </OffcanvasBody>
        </Offcanvas>
    </>
    
  )
}

export default index