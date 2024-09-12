import { useState, useEffect, Fragment } from "react"
import { Edit, Eye, Search, Trash2 } from "react-feather"
import {Card, CardBody, CardTitle, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, CardSubtitle, InputGroup, Input, InputGroupText} from "reactstrap"
import JDHelper from '../../Helpers/JDHelper'
// import StepperForm from "../../job-description/UpdateJobDescription/StepperForm"
import JDView from "../../Jobs-Setup/job-description/JD-View/index"
// import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import Masonry from 'react-masonry-component'
const JDList = ({CallBack, selectedJD}) => {
    const Helper = JDHelper()
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(true)
    const [JDList, setJDList] = useState([])
    const [viewJDList, setViewJDList] = useState(null)

    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [selectedItem, setSelectedItem] = useState()
    
    const toggleViewCanvasEnd = item => {
        setViewJDList(item) 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    const handleCardClick = item => {
        if (selectedItem === item) {
            setSelectedItem(null)
        } else {
            console.log(item)
            setSelectedItem(item)
            CallBack(item)
            // toggleViewCanvasEnd()
        }
    }
    
    const getJD = async () => {
        setLoading(true)
        await Helper.fetchJDList().then(data => {
                if (Object.values(data).length > 0) {
                    setJDList(data)
                    setSearchResults(data)
                    if (selectedJD !== null && selectedJD !== undefined) {
                        setSelectedItem(selectedJD) 
                        console.log(selectedJD)
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
    useEffect(() => {
            getJD()
    }, [])
//     useEffect(() => {
      
// }, [setSelectedItem])
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
          
        </div>
        {Object.values(searchResults).length > 0 ? (
            !loading ? (
                    <Masonry className="row js-animation">
                        {Object.values(searchResults).map((item) => (
                            <Card key={item.id} onClick={() => handleCardClick(item)} style={{ cursor: 'pointer', backgroundColor: selectedItem === item || (selectedJD && selectedJD.id === item.id) ? 'lightgray' : 'white' }}>
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
                                                title="View"
                                                onClick={() => toggleViewCanvasEnd(item)}
                                                >
                                                <Eye color="green"/>
                                            </button>
                                           
                                        </div>
                                    </div>
                                 
                                </div>
                                    
                            </CardBody>
                            </Card> 
                        ))}
                    </Masonry>
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

        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <JDView data={viewJDList} />
          </OffcanvasBody>
        </Offcanvas>
            
        </Fragment>
    )
}
export default JDList