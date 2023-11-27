import { useState } from 'react'
import { Download, Eye, Search } from 'react-feather'
import { Card, CardBody, Row, Col, Badge, InputGroup, Input, InputGroupText } from 'reactstrap'
import SearchHelper from '../../../../../Helpers/SearchHelper/SearchByObject'
const Assignments = ({ data }) => {
    const searchHelper = SearchHelper()
    const [searchResults, setSearchResults] = useState(data)
    const [searchQuery] = useState([])
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
  return (
    <Row>
        <Col md={12}>
            <h2>Assignments Details</h2>
        </Col>

            <Col md={12} className='my-2'>
                <>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                    <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search title...' onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                </InputGroup>
                {searchResults && searchResults.length > 0 ? (
                    searchResults.map((assignment, key) => (
                        <Card key={key}>
                            <CardBody>
                            <div className="row">
                                <div className="col-md-6">
                                    <h4>{assignment.title ? assignment.title : 'No title found'}</h4>
                                    <b>Deadline</b>: <Badge>{assignment.submission_deadline ? assignment.submission_deadline : 'N/A'}</Badge>
                                </div>
                                <div className="col-md-6">
                                    <div className="float-right">
                                        <button
                                            className="border-0 no-background"
                                            title="View"
                                            >
                                            <Eye color="gray"/>
                                        </button>
                                        <button
                                            className="border-0 no-background"
                                            title="Download"
                                            >
                                            <Download color="gray"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                               
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div className='my-2'>
                        No Assignment Found!
                    </div>
                )}
               </>
            </Col>
        </Row>
  )
}

export default Assignments