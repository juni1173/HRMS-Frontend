import "@styles/react/apps/app-users.scss"
import { Card, CardBody, Spinner, Nav, NavItem, NavLink, TabContent, TabPane, InputGroup, InputGroupText, Input } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
// import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
import apiHelper from "../../Helpers/ApiHelper"
import { useState, useEffect  } from "react"  
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import CandidateFilters from "./CandidateFilters"
import { Filter, Search } from "react-feather"
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
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
    const [departmentsdropdown] = useState([])
      const [staff_classificationdropdown] = useState([])
      const [positiondropdown] = useState([])
      const [jobdropdown] = useState([])
      const [position, setPosition] = useState('')
      const [department, setdepartment] = useState('')
      const [job, setjob] = useState('')
      const [sc, setsc] = useState('')
      const [score, setscore] = useState('')
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
       const formdata = new FormData()
       formdata['page'] = 1
       await Api.post(`/candidates/`, formdata)
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
        const formdata = new FormData()
        if (position !== null && position !== undefined && position !== '') {
            formdata['position'] = position 
        }
        if (job !== null && job !== undefined && job !== '') {
            formdata['job'] = job 
        }
        if (department !== null && department !== undefined && department !== '') {
            formdata['department'] = department
        }
        if (sc !== null && sc !== undefined && sc !== '') {
            formdata['staff_classification'] = sc
        }
        if (score !== null && score !== undefined && score !== '') {
            formdata['evaluation_score'] = score
        }
        
        // formdata['job'] = job ?? formdata['job']
        // formdata['department'] = department ?? formdata['department']
        // formdata['staff_classification'] = sc ?? formdata['staff_classification']
        
        formdata['page'] = page
       await Api.jsonPost(`/candidates/`, formdata)
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
        const formdata = new FormData()
        if (position !== null && position !== undefined && position !== '') {
            formdata['position'] = position 
        }
        if (job !== null && job !== undefined && job !== '') {
            formdata['job'] = job 
        }
        if (department !== null && department !== undefined && department !== '') {
            formdata['department'] = department
        }
        if (sc !== null && sc !== undefined && sc !== '') {
            formdata['staff_classification'] = sc
        }
        formdata['page'] = page
       await Api.jsonPost(`/candidates/`, formdata)
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
    const handleScoreChange = (e) => {
        if (e.key === 'Enter') {
active === '2' ? getQualifiedCandidate(1) : getDisqualifiedCandidate(1)
        }
      }
    useEffect(() => {
        if (active === '2') {
getQualifiedCandidate(1)
        } else if (active === '3') {
            getDisqualifiedCandidate(1)
        }
    }, [position, department, job, sc, active])
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
      
      const preDataApi = async () => {
        const response = await Api.get('/candidates/filter/pre/data/')
        if (response.status === 200) {
            if (Object.values(response.data.department).length > 0) {
              departmentsdropdown.splice(0, response.data.department.length)
             response.data.department.forEach(element => {
              departmentsdropdown.push({value: element.id, label: element.title})
             })
        } 
        if (Object.values(response.data.staff_classification).length > 0) {
          staff_classificationdropdown.splice(0, response.data.staff_classification.length)
         response.data.staff_classification.forEach(element => {
          staff_classificationdropdown.push({value: element.id, label: element.title})
         })
    } 
    if (Object.values(response.data.position).length > 0) {
      positiondropdown.splice(0, response.data.position.length)
     response.data.position.forEach(element => {
      positiondropdown.push({value: element.id, label: element.title})
     })
    } 
    if (Object.values(response.data.job).length > 0) {
      jobdropdown.splice(0, response.data.job.length)
     response.data.job.forEach(element => {
      jobdropdown.push({value: element.id, label: element.title})
     })
    } 
      } else {
            return Api.Toast('error', 'Data not found')
        }
    }
    useEffect(() => {
        preDataApi()
        // console.log(position)
        }, [])
    return (
        <>
        <button className="btn btn-outline-primary my-1" onClick={callFilters}><Filter/>Filters</button>
        <div className="row mt-6">

            {Object.values(candidateList).length > 0 ? (
                    <>
                        {filter && <>
                        <CandidateFilters getSearch={getSearch} candidateList={getSearchList()}/>
                         <div className='col-lg-6'>
                         <Select
                                  isClearable={true}
                                  options={departmentsdropdown}
                                  className='react-select mb-1'
                                  classNamePrefix='select'
                                  placeholder="Search by department"
                                  onChange={(selectedOption) => {
                                    if (selectedOption !== null) {
                                        setdepartment(selectedOption.value)
                                    } else {
                                        setdepartment('')
                                    } 
                              
                                }}
                              />
                         </div>
                         <div className='col-lg-6'>
                         <Select
                                  isClearable={true}
                                  options={staff_classificationdropdown}
                                  className='react-select mb-1'
                                  classNamePrefix='select'
                                  placeholder="Search by staff classification"
                                  onChange={(selectedOption) => {
                                    if (selectedOption !== null) {
                                        setsc(selectedOption.value)
                                    } else {
                                        setsc('')
                                    }
                              
                                }}
                              />
                         </div>
                         <div className='col-lg-6'>
                         <Select
                                  isClearable={true}
                                  options={positiondropdown}
                                  className='react-select mb-1'
                                  classNamePrefix='select'
                                  placeholder="Search by position"
                                  onChange={(selectedOption) => {
                                     if (selectedOption !== null) {
                                       setPosition(selectedOption.value)
                                   } else {
                                    setPosition('')

                                   }
                              
                                }}
                              />
                         </div>
                         <div className='col-lg-6'>
                         <Select
                                  isClearable={true}
                                  options={jobdropdown}
                                  className='react-select mb-1'
                                  classNamePrefix='select'
                                  placeholder="Search by job"
                                  onChange={(selectedOption) => {
                                     // console.log(selectedOption)
                                     if (selectedOption !== null) {
                                        setjob(selectedOption.value)
                                    } else {
                                        setjob('')
                                    }
                                     
                                }}
                              />
                         </div>
                         <div className='col-lg-6'>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                       <Search size={14} />
                    </InputGroupText>
                    <Input type='number' placeholder='search by score...' onChange={e => { setscore(e.target.value) }} onKeyDown={handleScoreChange}/>
                </InputGroup>
        </div>
        <div className='col-lg-6'></div>
                         </>
                        }
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