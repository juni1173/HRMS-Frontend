import "@styles/react/apps/app-users.scss"
import { Card, CardBody, Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
// import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
import apiHelper from "../../Helpers/ApiHelper"
import { useState, useEffect  } from "react"  
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import CandidateFilters from "./CandidateFilters"
import { Filter } from "react-feather"
import ReactPaginate from 'react-paginate'
const CandidateList = () => {
    const [loading, setLoading] = useState(false)
    const [filter, setFilters] = useState(false)
    const [active, setActive] = useState('2')
    const [candidateList, setCandidateList] = useState([])  
    const [qualifiedList, setqualifiedList] = useState([])
    const [disqualifiedList, setdisqualifiedList] = useState([])
    const [Stages] = useState([])
    const [searchResult, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [totalqualifiedPageCount, setqualifiedTotalPageCount] = useState(1)
    const [totaldisqualifiedPageCount, setdisqualifiedTotalPageCount] = useState(1)
    const Api = apiHelper() 
    const searchHelper = SearchHelper()
    const getStages = async () => {
        await Api.get(`/stages/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const stages = result.data
                    Stages.splice(0, Stages.length)
                        Stages.splice(0, Stages.length)
                        for (let i = 0; i < Object.values(stages).length; i++) {
                            Stages.push({value: stages[i].id, label: stages[i].title})
                        }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
               
                Api.Toast('error', 'Server not respnding')
            }
            })
    }
    const getCandidate = async () => {
        setLoading(true)
       getStages()
       await Api.get(`/candidates/?page=1`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        setCandidateList(result.data)
                        // setSearchResults(result.data)
                        const finalData = result.data
                        
                        setqualifiedList(finalData.candidate_job_list_qualified)
                        setdisqualifiedList(finalData.candidate_job_list_disqualified)
                        if (finalData.candidate_job_list_qualified && Object.values(finalData.candidate_job_list_qualified).length > 0) {
                            setqualifiedTotalPageCount(finalData.candidate_job_list_qualified[0].total_pages_qualified)
                        }
                        if (finalData.candidate_job_list_disqualified && Object.values(finalData.candidate_job_list_disqualified).length > 0) {
                            setdisqualifiedTotalPageCount(finalData.candidate_job_list_disqualified[0].total_pages_disqualified)
                        }
                        setSearchResults(finalData.candidate_job_list_qualified)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    setCandidateList([])
                    setSearchResults([])
                    setqualifiedList([])
                    setdisqualifiedList([])
                    Api.Toast('error', 'Server not respnding')
                }
              
            })
        setTimeout(() => {
            setLoading(false)
        }, 500)
            
    }
    const getQualifiedCandidate = async (page) => {
        setLoading(true)
       await Api.get(`/candidates/?page=${page}`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        // setSearchResults(result.data)
                        const finalData = result.data
                        
                        setqualifiedList(finalData.candidate_job_list_qualified)
                        if (finalData.candidate_job_list_qualified && Object.values(finalData.candidate_job_list_qualified).length > 0) {
                            setqualifiedTotalPageCount(finalData.candidate_job_list_qualified[0].total_pages_qualified)
                        }
                        setSearchResults(finalData.candidate_job_list_qualified)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    setSearchResults([])
                    setqualifiedList([])
                    Api.Toast('error', 'Server not respnding')
                }
              
            })
        setTimeout(() => {
            setLoading(false)
        }, 500)
            
    }
    const getDisqualifiedCandidate = async (page) => {
        setLoading(true)
       await Api.get(`/candidates/?page=${page}`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        // setSearchResults(result.data)
                        const finalData = result.data
                        
                        setdisqualifiedList(finalData.candidate_job_list_disqualified)
                       
                        if (finalData.candidate_job_list_disqualified && Object.values(finalData.candidate_job_list_disqualified).length > 0) {
                            setdisqualifiedTotalPageCount(finalData.candidate_job_list_disqualified[0].total_pages_disqualified)
                        }
                        setSearchResults(finalData.candidate_job_list_disqualified)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    setSearchResults([])
                    setdisqualifiedList([])
                    Api.Toast('error', 'Server not respnding')
                }
              
            })
        setTimeout(() => {
            setLoading(false)
        }, 500)
            
    }
    const getSearch = options => {
        // setLoading(true)
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
        // setTimeout(() => {
        //     setLoading(false)
        // }, 1000)
    }
    
    const callFilters = () => {
        setFilters(!filter)
    }
    const toggle = tab => {
        setActive(tab)
       switch (tab) {
        case '1' : return setSearchResults(candidateList)
        case '2' : return setSearchResults(qualifiedList)
        case '3' : return setSearchResults(disqualifiedList)
        default : return setSearchResults(qualifiedList)
       }
      }
    const getSearchList = () => {
        switch (active) {
            case '1' : return candidateList
            case '2' : return qualifiedList
            case '3' : return disqualifiedList
            default : return candidateList
           }
    }
    const handleQualifiedPageClick = (event) => {
        getQualifiedCandidate(event.selected + 1)
        }
    const handleDisqualifiedPageClick = (event) => {
        getDisqualifiedCandidate(event.selected + 1)
        }
    useEffect(() => {
        getCandidate()
      }, [setCandidateList])
    return (
        <>
        <button className="btn btn-outline-primary my-1" onClick={callFilters}><Filter/>Filters</button>
        <div className="row mt-6">

            {Object.values(candidateList).length > 0 ? (
                    <>
                        {filter && <CandidateFilters getSearch={getSearch} candidateList={getSearchList()}/>}
                        <div className="col-lg-6">
                            <Nav tabs>
                                {/* <div className='col-md-1'>
                                    <NavItem>
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }} 
                                    >
                                    ALL
                                    </NavLink>
                                    </NavItem>
                                </div> */}
                                <div className='col-md-3'>
                                    <NavItem>
                                    <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                    toggle('2')
                                    }}  
                                    >
                                    Qualified
                                    </NavLink>
                                    </NavItem>
                                </div>
                                <div className='col-md-3'>
                                    <NavItem>
                                    <NavLink
                                        active={active === '3'}
                                        onClick={() => {
                                        toggle('3')
                                        }} 
                                    >
                                    Disqualified
                                    </NavLink>
                                    </NavItem>
                                </div>
                                {/* <div className='col-md-2'>
                                    <NavItem>
                                    <NavLink
                                        active={active === '4'}
                                        onClick={() => {
                                        toggle('4')
                                        }} 
                                    >
                                    Deleted
                                    </NavLink>
                                    </NavItem>
                                </div> */}
                            </Nav>
                        </div>
                        <div className="col-lg-12">
                            <TabContent className='py-50' activeTab={active}>
                                {/* <TabPane tabId='1'>
                                    <div>
                                        {!loading ? (
                                            Object.values(searchResult).length > 0 ? (
                                                <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate}/>
                                            ) : (
                                                <Card>
                                                    <CardBody>
                                                        <p>No Candidates Found</p>
                                                    </CardBody>
                                                </Card>
                                            )
                                            
                                        ) : (
                                        <div className="text-center"> <Spinner /></div>
                                        )}
                                        
                                    </div>
                                </TabPane> */}
                                <TabPane tabId='2'>
                                    <div>
                                    {!loading ? (
                                                    (searchResult && Object.values(searchResult).length > 0) ? (
                                                        <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate} rowsPerPage={5}/>
                                                        ) : (
                                                        <Card>
                                                            <CardBody>
                                                                <p>No Qualified Candidate Found...</p>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                    ) : (
                                                        <div className="text-center"> <Spinner /></div>
                                                    )}
                                                    <ReactPaginate
                                                        breakLabel="..."
                                                        nextLabel=">"
                                                        onPageChange={handleQualifiedPageClick}
                                                        pageRangeDisplayed={5}
                                                        pageCount={totalqualifiedPageCount}
                                                        previousLabel="<"
                                                        renderOnZeroPageCount={null}
                                                        containerClassName='pagination'
                                                        pageLinkClassName='page-num'
                                                        previousLinkClassName='page-num'
                                                        nextLinkClassName='page-num'
                                                        activeLinkClassName='active'
                                                      />
                                                    
                                            </div>
                                </TabPane>
                                <TabPane tabId='3'>
                                    <div>
                                    {!loading ? (
                                                    (searchResult && Object.values(searchResult).length > 0) ? (
                                                        
                                                        <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate}/>
                                                       
                                                    ) : (
                                                        <Card>
                                                            <CardBody>
                                                                <p>No Disqualified Candidate Found...</p>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                    
                                                ) : (
                                                   <div className="text-center"> <Spinner /></div>
                                                )}
                                                 <ReactPaginate
                                                        breakLabel="..."
                                                        nextLabel=">"
                                                        onPageChange={handleDisqualifiedPageClick}
                                                        pageRangeDisplayed={5}
                                                        pageCount={totaldisqualifiedPageCount}
                                                        previousLabel="<"
                                                        renderOnZeroPageCount={null}
                                                        containerClassName='pagination'
                                                        pageLinkClassName='page-num'
                                                        previousLinkClassName='page-num'
                                                        nextLinkClassName='page-num'
                                                        activeLinkClassName='active'
                                                      />
                                            </div>
                                </TabPane>
                            </TabContent> 
                        </div>
                    
                </>
                ) : (
                        <Card>
                            <CardBody>
                                No Candidates Found...
                            </CardBody>
                        </Card>
                )
            }
        </div>    
        </>
    )
}

export default CandidateList