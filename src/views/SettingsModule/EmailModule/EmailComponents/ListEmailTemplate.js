import { useState, useEffect, Fragment } from "react"
import { Edit, Eye, Search, Trash2} from "react-feather"
import {Card, CardTitle, CardBody, Badge, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody, InputGroup, Input, InputGroupText} from "reactstrap"
import UpdateEmailTemplate from './UpdateEmailTemplate'
import ViewEmailTemplate from "./ViewEmailTemplate"
import EmailTemplateHelper from "../../../Helpers/EmailTemplateHelper"
import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
const ListEmailTemplate = ({count, CreateFormToggle}) => {
    const Helper = EmailTemplateHelper()
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(true)
    const [EmailList, setEmailList] = useState([])
    const [editEmailList, setEditEmailList] = useState(null)
    const [viewEmailList, setViewEmailList] = useState(null)

    const [canvasUpdatePlacement, setCanvasUpdatePlacement] = useState('end')
    const [canvasUpdateOpen, setCanvasUpdateOpen] = useState(false)
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])

    const toggleUpdateCanvasEnd = (item_data) => {
        setEditEmailList(item_data)
        setCanvasUpdatePlacement('end')
        setCanvasUpdateOpen(!canvasUpdateOpen)
    
    }
    const toggleViewCanvasEnd = item => {
        setViewEmailList(item) 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    
    const getEmails = async () => {
        setLoading(true)
        if (EmailList !== null) {
            EmailList.splice(0, EmailList.length)
        }
        await Helper.fetchEmailList().then(data => {
            if (data) {
                if (Object.values(data).length > 0) {
                    setEmailList(data)
                    setSearchResults(data)
                } else {
                    setEmailList([])
                    setSearchResults([])
                }
            } else {
                setEmailList([])
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
    const CallBack = () => {
        setCanvasUpdateOpen(false)
        getEmails()
    }
    useEffect(() => {
        if (count > 0) {
            getEmails()
        } else {
            getEmails()
        }
    }, [count])
  return (
    <Fragment>
        <div className='row  my-1'>
              <div className='col-lg-6'>
                <div className="col-lg-6">
                
                  <InputGroup className='input-group-merge mb-2'>
                      <InputGroupText>
                      <Search size={14} />
                      </InputGroupText>
                      <Input placeholder='search title...' onChange={e => { getSearch({list: EmailList, key: 'title', value: e.target.value }) } }/>
                  </InputGroup>
                 
                </div>
              </div>
              <div className='col-lg-6'>
                <button className='btn btn-primary float-right' onClick={CreateFormToggle} >Add Email Template</button> 
              </div>
            </div>
            <div className="row">
        {Object.values(searchResults).length > 0 ? (
            !loading ? (
                Object.values(searchResults).map((item, index) => (
                    
                        <div className="col-lg-6" key={index}>
                            <Card >
                                <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                        <CardTitle tag='h1'>{item.title}</CardTitle>
                                        
                                        </div>
                                        {/* <div className="col-md-3">
                                            <Badge color='light-info'>
                                                    Subject 
                                            </Badge><br></br>
                                            <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.subject_line && item.subject_line}</span>
                                        </div> */}
                                        {/* <div className="col-md-3">
                                            <Badge color='light-success'>
                                                Footer
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.footer && item.footer}</span>
                                            
                                        </div> */}
                                        <div className="col-lg-6 float-right">
                                            
                                            <div className="float-right">
                                            <button
                                                    className="border-0 no-background"
                                                    title="View"
                                                    onClick={() => toggleViewCanvasEnd(item)}
                                                    >
                                                    <Eye color="green"/>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Edit"
                                                    onClick={() => toggleUpdateCanvasEnd(item)}
                                                    >
                                                    <Edit color="orange"/>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Delete"
                                                    // onClick={() => deleteJD(item.id)}
                                                    >
                                                    <Trash2 color="red"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                        
                                </CardBody>
                            </Card> 
                        </div>
                   
                ))
                
            ) : (
                <div className="text-center"><Spinner /></div>
            )
           
        ) : (
            <Card>
            <CardBody>
                No Email Template found...
            </CardBody>
            </Card> 
        )}
         </div>
        <Offcanvas direction={canvasUpdatePlacement} isOpen={canvasUpdateOpen} toggle={toggleUpdateCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleUpdateCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <UpdateEmailTemplate updateCallBack={CallBack} editEmailData={editEmailList}/>
          </OffcanvasBody>
        </Offcanvas>

        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <ViewEmailTemplate data={viewEmailList} />
          </OffcanvasBody>
        </Offcanvas>
            
        </Fragment>
  )
}

export default ListEmailTemplate