import "@styles/react/apps/app-users.scss"
import { Card, CardBody, Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
// import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
import apiHelper from "../../Helpers/ApiHelper"
import { useState, useEffect  } from "react"  
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import CandidateFilters from "./CandidateFilters"
import { Filter } from "react-feather"
const CandidateList = () => {
    const [loading, setLoading] = useState(false)
    const [filter, setFilters] = useState(false)
    const [active, setActive] = useState('2')
    const [candidateList, setCandidateList] = useState([])  
    const [qualifiedList] = useState([])
    const [disqualifiedList] = useState([])
    const [Stages] = useState([])
    const [searchResult, setSearchResults] = useState([])
    const [searchQuery] = useState([])
  
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
       await Api.get(`/candidates/`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        setCandidateList(result.data)
                        // setSearchResults(result.data)
                        const finalData = result.data
                        qualifiedList.splice(0, qualifiedList.length)
                        disqualifiedList.splice(0, disqualifiedList.length)
                        for (let i = 0; i < finalData.length; i++) {
                            if (finalData[i].is_qualified) {
                                qualifiedList.push(finalData[i])
                            } else {
                                disqualifiedList.push(finalData[i])
                            }
                        }
                        setSearchResults(qualifiedList)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    setCandidateList([])
                    setSearchResults([])
                    qualifiedList.splice(0, qualifiedList.length)
                    disqualifiedList.splice(0, disqualifiedList.length)
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
                                                    Object.values(searchResult).length > 0 ? (
                                                        <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate} rowsPerPage={5}/>
                                                    ) : (
                                                        <Card>
                                                            <CardBody>
                                                                <p>No Qualified Candidate Found...</p>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                    
                                                ) : (
                                                    <Spinner />
                                                )}
                                                
                                            </div>
                                </TabPane>
                                <TabPane tabId='3'>
                                    <div>
                                    {!loading ? (
                                                    Object.values(searchResult).length > 0 ? (
                                                        <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate}/>
                                                    ) : (
                                                        <Card>
                                                            <CardBody>
                                                                <p>No Disqualified Candidate Found...</p>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                    
                                                ) : (
                                                    <Spinner />
                                                )}
                                                
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