import { Fragment, useEffect, useState } from "react"
import { Table, Container, Spinner, Card, Row, Col, CardBody, CardSubtitle, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, InputGroup, Input, InputGroupText, Modal, ModalBody, ModalHeader} from "reactstrap"
import { Download, Eye, File, Search, Edit2 } from "react-feather"
import apiHelper from "../../Helpers/ApiHelper"
import KavSkillsLogo from "../../../assets/images/logo/kavskills-logo.png"
import { CSVLink } from "react-csv"
import KavskillView from "./KavskillView"
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import UpdateCandidate from "./UpdateCandidate"
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const searchHelper = SearchHelper()
    const [searchQuery] = useState([])
    const [preData, setPreData] = useState([])
    const [data, setData] = useState([])
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [currentitems, setCurrentItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const [show, setShow] = useState(false)
const [currentCandidate, setCurrentCandidate] = useState()
    const itemsCount = [
        {value: 10, label: '10'},
        {value: 25, label: '25'},
        {value: 50, label: '50'},
        {value: 100, label: '100'}
    ]
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kav_skills/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setSearchResults(result.data)
                    setPreData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const csvData = [
        ["Name", "Skill", "Contact", "Financial Aid", "CNIC", "Email", "Resume"],
        ...preData.map((item) => [
            item.full_name,
            item.skill_type_title,
            item.contact_number,
            item.financial_aid ? (
                item.financial_aid_reason ? (
                    item.financial_aid_reason
                ) : (
                    'Applied but reason not given'
                )
            ) : (
                'N/A'
            ),
            item.cnic_no,
            item.email,
            item.kav_skills_resume
        ])
    ]

    const DiscardModal = () => {
        setShow(false)
      }

      const handleModalClosed = () => {
        setShow(false)
      }

    const toggleViewCanvasEnd = item => {
        setData(item) 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    useEffect(() => {
        getPreData()
        }, [setSearchResults])

        const CallBack = () => {
            getPreData()
            setShow(false)
          }
        
        
        useEffect(() => {
            const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
            setCurrentItems(searchResults.slice(itemOffset, endOffset))
            setPageCount(Math.ceil(searchResults.length / itemsPerPage))
            }, [itemOffset, itemsPerPage, searchResults])
    
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % searchResults.length
            setItemOffset(newOffset)
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
                    setItemOffset(0)
                    setSearchResults(searchHelper.searchObj(options))
                    setCurrentItems(searchHelper.searchObj(options))
                    
                } else {
                    
                    searchQuery[options.key] = options.value
                    options.value = {query: searchQuery}
                    setItemOffset(0)
                    setSearchResults(searchHelper.searchObj(options))
                    setCurrentItems(searchHelper.searchObj(options))
                }
                
            }
   return (
    <Fragment>
        <Row>
        <Col md={6}>
            <img
            className='mb-4'
            src={KavSkillsLogo}
            alt="Kavskills"
            width="200"
            />
        </Col>
        <Col md={6} >
            <CSVLink className="btn btn-primary float-right mt-2" filename="HRMS_Kavskills_List" data={csvData}>Download <Download/> </CSVLink>
        </Col>
        <div className='row  my-1'>
                 {/* <Col md={3}>
                    <h3>Candidate List</h3>
                    <span>Showing {Object.values(currentitems).length > 0 ? itemsPerPage : 0} results per page</span>
                </Col>  */}
                <Col md={4}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='Search by name ...'  onChange={e => { getSearch({list: preData, key: 'full_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='Search by skill ...'  onChange={e => { getSearch({list: preData, key: 'skill_type_title', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={2}>
                    <Select 
                    placeholder="Entries"
                    options={itemsCount}
                    onChange={e => {
                        setItemsPerPage(e.value)
                        setItemOffset(0)
                    }}
                    />
                </Col>
       
        </div>
        </Row>
                                
        {!loading ? (
            
            // currentitems && Object.values(currentitems).length > 0 ? (
            //     <Row>
            //    {currentitems.map((item, key) => (
            //     <Col md={6}>
            //         <Card key={key}>
            //             <CardBody>
            //                 <Row>
            //                     <Col md={6}>
            //                     <CardTitle tag='h1'>{item.full_name}</CardTitle>
            //                         <CardSubtitle><Badge color='light-primary'> 
            //                         {item.skill_type_title}
            //                             </Badge></CardSubtitle>
            //                     </Col>
            //                     <div className="col-lg-6 float-right">
                                            
            //                                 <div className="float-right">
            //                                 <button
            //                                         className="border-0 no-background"
            //                                         title="Edit"
            //                                         onClick={e => {
            //                                             e.preventDefault()
            //                                             setCurrentCandidate(item)
            //                                             setShow(true)
            //                                         }} 
            //                                         >
            //                                         <Edit2 color="red"/>
            //                                     </button>
            //                                 <button
            //                                         className="border-0 no-background"
            //                                         title="View"
            //                                         onClick={() => toggleViewCanvasEnd(item)}
            //                                         >
            //                                         <Eye color="green"/>
            //                                     </button>
            //                                     <a target="_blank" href={`${item.kav_skills_resume}`}>
            //                                     <button
            //                                         className="border-0 no-background"
            //                                         title="Resume"
            //                                         >
            //                                         <File color="orange"/>
            //                                     </button>
            //                                     </a>
            //                                 </div>
            //                             </div>
                                
            //                 </Row>
            //             </CardBody>
            //         </Card>
            //         </Col>
            //     ))}
            //     </Row>
            //     ) : (
            //         <div className='text-center'>No Data Found!</div>
            //     )
                       <Table bordered striped responsive className='my-1'>
                        <thead  className='table-dark text-center'>
                            <tr>
                            <th>Name</th>
                            <th>Skill</th>
                            <th>Contact</th>
                            <th>Finanical aid</th>
                            <th>Cnic</th>
                            <th>Email</th>
                            <th>Resume</th>
                            <th>Progress</th>
                            <th className="nowrap">Actions</th>
                            </tr>
                        </thead>
                        
                        {currentitems && Object.values(currentitems).length > 0 ? (
                        preData.map((item, key) => (
                            <tbody>
                            <tr key={key}>
                                <td>{item.full_name}</td>
                                <td>{item.skill_type_title}</td>
                                <td>{item.contact_number}</td>
                                {item.financial_aid ? (
                                    item.financial_aid_reason ? (
                                        <td>{item.financial_aid_reason}</td>
                                    ) : (
                                        <td>Applied but reason not given</td>
                                    )
                                ) : (
                                    <td>N/A</td>
                                )}
                                <td>{item.cnic_no}</td>
                                <td>{item.email}</td>
                                <td>
                                    <a className="btn btn-primary btn-sm" target="_blank" href={`${item.kav_skills_resume}`}><File/></a>
                                </td>
                                <td>{item.conversion_status && item.conversion_status}</td>
                                <td className="nowrap"><button
                                                    className="border-0 no-background"
                                                    title="Edit"
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        setCurrentCandidate(item)
                                                        setShow(true)
                                                    }} 
                                                    >
                                                    <Edit2 color="red"/>
                                                </button>
                                            <button
                                                    className="border-0 no-background"
                                                    title="View"
                                                    onClick={() => toggleViewCanvasEnd(item)}
                                                    >
                                                    <Eye color="green"/>
                                                </button>
                                              </td>
                            </tr>
                        </tbody>    
                        ))
                        
                        ) : (
                            <div className='text-center'>No Data Found!</div>
                        )}
                        
                       </Table>
                
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
        <div className="mt-2">    
        <Container> 
           
       <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName='pagination'
          pageLinkClassName='page-num'
          previousLinkClassName='page-num'
          nextLinkClassName='page-num'
          activeLinkClassName='active'
        />
    
        </Container>
        </div>    
        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <KavskillView data={data} />
          </OffcanvasBody>
        </Offcanvas>
        <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1>Update Candidate</h1>
          </div>
            <UpdateCandidate candidate={currentCandidate} CallBack={CallBack} DiscardModal={DiscardModal}/>
        </ModalBody>
      </Modal>
    </Fragment>
   )
}
export default index