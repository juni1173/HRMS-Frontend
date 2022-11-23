import "@styles/react/apps/app-users.scss"
import { Spinner } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
import apiHelper from "../../Helpers/ApiHelper"
import { useState, useEffect  } from "react"  
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import CandidateFilters from "./CandidateFilters"
const CandidateList = () => {
    const [loading, setLoading] = useState(true)
    const [filter, setFilters] = useState(false)
    const [candidateList, setCandidateList] = useState([])  
    const [Stages] = useState([])
    const [searchResult, setSearchResults] = useState([])
    const [searchQuery] = useState([])
  
    const Api = apiHelper() 
    const searchHelper = SearchHelper()
    const getCandidate = () => {
        setLoading(true)
        Api.get(`/recruitment/stages/`).then(stages => {
            Stages.splice(0, Stages.length)
            for (let i = 0; i < Object.values(stages).length; i++) {
                Stages.push({value: stages[i].id, label: stages[i].title})
            }
        })
        Api.get(`/candidates/`)
            .then((result) => {
              setCandidateList(result.data)
              setSearchResults(result.data)
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
            
    }
    const getSearch = options => {
        setLoading(true)
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
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    
    const callFilters = () => {
        setFilters(!filter)
    }
    useEffect(() => {
        getCandidate()
      }, [])
    return (
        <>
        <button className="btn btn-outline-primary my-1" onClick={callFilters}>Filters</button>
        <div className="row mt-6">
            {filter && <CandidateFilters getSearch={getSearch} candidateList={candidateList}/>}
            <CandidateListNavBar/>
            {!loading ? <CandidateListTable data={searchResult} stages={Stages} getCandidate={getCandidate}/> : <div className="col-lg-12 text-center"><Spinner /></div>}
        </div>    
        </>
    )
}

export default CandidateList