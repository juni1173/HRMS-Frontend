import { useState, useEffect, Fragment } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddTopics from "./AddTopics"
import TopicHelper from "../../../../../Helpers/LearningDevelopmentHelper/Course-subModules/TopicsHelper"
import apiHelper from "../../../../../Helpers/ApiHelper"
const index = ({ module_id, key }) => {
    const Helper = TopicHelper()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [topicList, settopicList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchTopics = async () => {
        setLoading(true)
        await Helper.fetchTopicList(module_id).then(result => {
            if (result) {
                settopicList(result) 
            } else {
                settopicList([])
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    }
  
    const CallBack = () => {
        toggleCanvasEnd()  
        fetchTopics()
    }
    useEffect(() => {
        fetchTopics()
    }, [])
  return (
    <Fragment key={key}>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Topics</h2>
            </div>
            <div className="col-lg-6">
            {Api.role === 'admin' && (
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Course"
                    onClick={toggleCanvasEnd}
                    >    
                    <Plus />Add topic
                </button>
            )}
                
            </div>
        </div>
        {!loading ? (
        topicList.length > 0 ? (
            topicList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchTopics} module_id={module_id}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Topics Data Found...</p>
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
            <AddTopics CallBack={CallBack} module_id={module_id}/>
            </OffcanvasBody>
        </Offcanvas>
    </Fragment>
    
  )
}

export default index