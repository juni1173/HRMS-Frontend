import { Fragment, useEffect, useState, useCallback } from "react"
import { Row, Col, Button, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import apiHelper from "../../../../../Helpers/ApiHelper"
import PlanList from "./PlanList"
import AddPlan from "./AddPlan"
const index = () => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
    const getTrainings = async () => {
        setLoading(true)
        await Api.get(`/training/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
    useEffect(() => {
        getTrainings()
        }, [])

        const CallBack = useCallback(() => {
            getTrainings()
          }, [data])
  return (
    <Fragment>
      <Row>
        <Col md={6}>
          <h2>Trainings</h2>
        </Col>
        <Col md={6}>
            <Button className='btn btn-success float-right' onClick={toggleCanvasEnd}>
              Add a Plan
            </Button>
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col md={12}>
          {!loading ? (
            <PlanList data={data} CallBack={CallBack}/>
          ) : (
            <div className='text-center'><Spinner /></div> 
          )}
        </Col>
      </Row>
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <AddPlan/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default index