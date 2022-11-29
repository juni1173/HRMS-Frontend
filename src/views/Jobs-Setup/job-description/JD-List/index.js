import { useState, useEffect, Fragment } from "react"
import { Edit, Eye, Search, XCircle } from "react-feather"
import {Card, CardBody, CardTitle, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, CardSubtitle, InputGroup, Input, InputGroupText} from "reactstrap"
import JDHelper from "../../../Helpers/JDHelper"
import StepperForm from "../../job-description/UpdateJobDescription/StepperForm"
import JDView from "../JD-View"
import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
const JDList = ({count, Canvas}) => {
    const Helper = JDHelper()
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(true)
    const [JDList, setJDList] = useState([])
    const [editJDList, setEditJDList] = useState(null)
    const [viewJDList, setViewJDList] = useState(null)

    const [canvasUpdatePlacement, setCanvasUpdatePlacement] = useState('end')
    const [canvasUpdateOpen, setCanvasUpdateOpen] = useState(false)
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    
    const toggleUpdateCanvasEnd = (item_data) => {
        setEditJDList(item_data)
        setCanvasUpdatePlacement('end')
        setCanvasUpdateOpen(!canvasUpdateOpen)
    
    }
    const toggleViewCanvasEnd = item => {
        setViewJDList(item) 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    
    const getJD = async () => {
        setLoading(true)
        if (JDList !== null) {
            JDList.splice(0, JDList.length)
        }
        await Helper.fetchJDList().then(data => {
            if (data) {
                if (Object.values(data).length > 0) {
                    setJDList(data)
                    setSearchResults(data)
                } else {
                    setJDList([])
                    setSearchResults([])
                }
            } else {
                setJDList([])
                setSearchResults([])
            }
            
        })
        setTimeout(() => {
            setLoading(false)
          }, 1000)
    }
    // const handleSearchChange = (e) => {
    //     if (!e.target.value) return setSearchResults(JDList)
    //     const resultsArray =  JDList.filter(jdList => jdList.title.toLowerCase().includes((e.target.value).toLowerCase()))
    //     setSearchResults(resultsArray)
    // }
    const getSearch = options => {
        
            if (options.value === '' || options.value === null || options.value === undefined) {

                if (options.key in searchQuery) {
                    delete searchQuery[options.key]
                } 
                if (Object.values(searchQuery).length > 0) {
                    options.value = {query: searchQuery}
                } else {
                    options.value = {}
                }
                setSearchResults(searchHelper.searchObj(options))
                
            } else {
                
                searchQuery[options.key] = options.value
                options.value = {query: searchQuery}
                setSearchResults(searchHelper.searchObj(options))
            }
            
    }
    const CallBack = () => {
        setCanvasUpdateOpen(false)
        getJD()
    }
    useEffect(() => {
        if (count > 0) {
            getJD()
        } else {
            getJD()
        }
    }, [count])
    const deleteJD = id => {
        Helper.deleteJD(id).then(() => {
            getJD()
        })
    }
    return (        
        <Fragment>
        <div className='row  my-1'>
              <div className='col-lg-6'>
                <div className="col-lg-6">
                
                  <InputGroup className='input-group-merge mb-2'>
                      <InputGroupText>
                      <Search size={14} />
                      </InputGroupText>
                      <Input placeholder='search title...' onChange={e => { getSearch({list: JDList, key: 'title', value: e.target.value }) } }/>
                  </InputGroup>
                 
                </div>
              </div>
              <div className='col-lg-6'>
                <button className='btn btn-primary float-right' onClick={Canvas} >Add Job Description</button> 
              </div>
            </div>
        {Object.values(searchResults).length > 0 ? (
            !loading ? (
                Object.values(searchResults).map((item) => (
                    <Card key={item.id}>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-3">
                              <CardTitle tag='h1'>{item.title}</CardTitle>
                              <CardSubtitle><Badge color='light-warning'>
                                        code 
                                </Badge>{`${item.code}`}</CardSubtitle>
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-info'>
                                        Position 
                                </Badge><br></br>
                                <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.position_title && item.position_title}</span>
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-success'>
                                    Department
                                </Badge><br></br>
                                <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.department_title && item.department_title}</span>
                                
                            </div>
                            <div className="col-lg-3 float-right">
                                
                                <div className="float-right">
                                <button
                                        className="border-0 no-background"
                                        title="Edit Job"
                                        onClick={() => toggleViewCanvasEnd(item)}
                                        >
                                        <Eye color="green"/>
                                    </button>
                                    <button
                                        className="border-0 no-background"
                                        title="Edit Job"
                                        onClick={() => toggleUpdateCanvasEnd(item)}
                                        >
                                        <Edit color="orange"/>
                                    </button>
                                    <button
                                        className="border-0 no-background"
                                        title="Delete JD"
                                        onClick={() => deleteJD(item.id)}
                                        >
                                        <XCircle color="red"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                         {/* <hr></hr> */}
                        {/* <div className="row">
                           
                            <div className="col-lg-6 text-center">
                                <Badge color='light-danger'>
                                    Specification
                                </Badge> 
                                <table className="table mt-2 JD-Card-table">
                                    <thead className='table-dark'>
                                        <tr>
                                        <th>Dimension</th>
                                        <th>Essentail</th>
                                        <th>Desirable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(item.jd_specifications).map((specification) => ( 
                                        <tr key={specification.id}>
                                            <td>{specification.jd_dimension}</td> 
                                            <td>{specification.desirable}</td>
                                            <td>{specification.desirable}</td> 
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-lg-6 text-center">
                                <Badge color='light-primary'>
                                    Additional Information
                                </Badge>
                                <table className="table mt-2 JD-Card-table">
                                    <thead className='table-dark'>
                                        <tr>
                                        <th>Dimension</th>
                                        <th>Essentail</th>
                                        <th>Desirable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(item.jd_specifications).map((specification, index) => ( 
                                        <tr key={index}>
                                            <td>{specification.jd_dimension}</td> 
                                            <td>{specification.desirable}</td>
                                            <td>{specification.desirable}</td> 
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div> */}
                         
                            
                    </CardBody>
                    </Card> 
                ))
                
            ) : (
                <div className="text-center"><Spinner /></div>
            )
           
        ) : (
            <Card>
            <CardBody>
                No job descriptions found...
            </CardBody>
            </Card> 
        )}
        <Offcanvas direction={canvasUpdatePlacement} isOpen={canvasUpdateOpen} toggle={toggleUpdateCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleUpdateCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <StepperForm updateCallBack={CallBack} eidtJdData={editJDList}/>
          </OffcanvasBody>
        </Offcanvas>

        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <JDView data={viewJDList} />
          </OffcanvasBody>
        </Offcanvas>
            
        </Fragment>
    )
}
JDList.defaultProp = {
    count: 1
}
export default JDList