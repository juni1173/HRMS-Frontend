import React, { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Plus, Search} from "react-feather"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import Avatar from '@components/avatar'
import { Container, Row, Input, Badge, InputGroup, InputGroupText, Col, Spinner, Card, CardBody, Label, Button } from 'reactstrap'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'
import ReactPaginate from 'react-paginate'
import Select from "react-select"
import Masonry from 'react-masonry-component'
const ParticipantsComponent = ({CallBack, data}) => {
  const Api = apiHelper()
  const searchHelper = SearchHelper()
  const [loading, setLoading] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
  const [employeeActiveList, setEmployeeActiveList] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [itemOffset, setItemOffset] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(50)
  const [pageCount, setPageCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const [searchQuery] = useState([])
    
  const [selectedOptions, setSelectedOptions] = useState(data ? data : [])
  const updateSwitches = () => {
    const updatedSwitchValues = {}
    if (data.length > 0) {
      data.forEach(item => {
          updatedSwitchValues[item['hrms_user']] = item.is_host === true
      })
    }
    return updatedSwitchValues
        }
  const [switchValues, setSwitchValues] = useState(updateSwitches())
  const getEmployeeData = async () => {
      setLoading(true)
      await Api.get(`/employees/`).then(result => {
          if (result) {
              if (result.status === 200) {
                  setEmployeeActiveList(result.data.active_employees)
                  setSearchResults(result.data.active_employees)
                  setSelectedOptions([])
                  if (data.length > 0) {
                    data.forEach(item => {
                        const foundEmployee = result.data.active_employees.find(pre => pre.hrmsuser === item['hrms_user'])
                        if (foundEmployee) {
                            setSelectedOptions(prevState => [
                                ...prevState,
                                { value: foundEmployee.hrmsuser, label: foundEmployee.name }
                            ])
                        }
                    })
                   
                }
              } else {
                  Api.Toast('error', result.message)
              }
          } else (
           Api.Toast('error', 'Server not responding!')   
          )
      })  
      setTimeout(() => {
          setLoading(false)
      }, 500)
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
  const itemsCount = [
    {value: 50, label: '50'},
    {value: 100, label: '100'},
    {value: 150, label: '150'},
    {value: 200, label: '200'}
]
const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % searchResults.length
  setItemOffset(newOffset)
  }
  const isItemSelected = (itemId) => selectedOptions.find(e => e.value === itemId)
  useEffect(() => {
      getEmployeeData()
      }, [setSearchResults])
      useEffect(() => {
          const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
          setCurrentItems(searchResults.slice(itemOffset, endOffset))
          setPageCount(Math.ceil(searchResults.length / itemsPerPage))
          }, [itemOffset, itemsPerPage, searchResults])

    const handleOptionChange = (id, name) => {
            setViewLoading(true)
            // Check if the ID already exists in selectedOptions
            const index = selectedOptions.findIndex(option => option.value === id)
          
            if (index !== -1) {
              // If the ID exists, remove it from selectedOptions
              setSelectedOptions(prevSelectedOptions => {
                const updatedOptions = [...prevSelectedOptions]
                updatedOptions.splice(index, 1) // Remove the element at index
                return updatedOptions
              })
            } else {
              // If the ID doesn't exist, add it to selectedOptions
              setSelectedOptions(prevSelectedOptions => [
                ...prevSelectedOptions,
                { value: id, label: name, is_host: false }
              ])
            }
            setTimeout(() => {
              setViewLoading(false)
            }, 100)
          }
          
  const handleSwitchChange = (option) => () => {
    setSwitchValues((prevValues) => ({
      ...prevValues,
      [option.value]: !prevValues[option.value]
    }))
  }
  const getHost = (id) => {
    return Object.keys(switchValues).some(key => {
      return parseInt(key) === parseInt(id) && switchValues[key]
    })
  }
  const handleDone = () => {
      setViewLoading(true)

    const transformedArr = []

    Object.values(selectedOptions).map(item => {
      const obj = {}
      obj['hrms_user'] = item.value
      if (getHost(item.value)) {
        obj.is_host = true
      } else {
        obj.is_host = false
      }
      transformedArr.push(obj)
    })
    CallBack(transformedArr)
    setTimeout(() => {
        setViewLoading(false)
      // console.warn(transformedArr)
    }, 500)
    
  }
  return (
    <Row>
       
      <Container>
        <Row>
          <Col md='8' className='border-right'>
          <Container>
          <div className='row  my-1'>
              <Col md={3}>
                  <h3>Employee List</h3>
                  <span>Showing {Object.values(currentItems).length > 0 ? itemsPerPage : 0} results per page</span>
              </Col>
              <Col md={6}>
                  <InputGroup className='input-group-merge mb-2'>
                      <InputGroupText>
                          <Search size={14} />
                      </InputGroupText>
                      <Input placeholder='search employee name...'  onChange={e => { getSearch({list: employeeActiveList, key: 'name', value: e.target.value }) } }/>
                  </InputGroup>
              </Col>
              <Col md={3}>
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
      </Container>
          <Container>
          <Masonry className="row js-animation">
          {!loading ? (
          Object.values(currentItems).length > 0 ? (
          Object.values(currentItems).map((item) => (
              <Col md={4} key={item.uuid}>
              <Card style={{cursor: 'pointer'}} onClick={() => handleOptionChange(item.hrmsuser, item.name)} className={isItemSelected(item.hrmsuser) ? 'bg-primary' : ''} >
                  <CardBody>
                          <div className="text-center">
                          {/* <CardTitle tag='h1'> </CardTitle> */}
                              <Badge color='light-warning'>
                              {item.profile_image ?  <Avatar img={`${Api.BaseUrl}${item.profile_image}`} size='lg' alt="logo" /> : <Avatar img={user_blank} size='lg' alt="logo" />}   
                              </Badge> 
                              <br></br>
                              <strong className={isItemSelected(item.hrmsuser) ? 'text-white' : ''}>{item.name ? item.name : <Badge color="light-danger">N/A</Badge>}</strong>
                          </div>
                  </CardBody>
              </Card> 
              </Col>
          ))) : (
              <Col md={12}>
                  <Card>
                      <CardBody>
                          No employee found!
                      </CardBody>
                  </Card>
              </Col>
          )) : (
              <div className="text-center"><Spinner /></div>
          )
          }
          </Masonry>
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
          </Col>
          <Col md='4'>
          {!viewLoading ? (
          selectedOptions.length > 0 ? (
            <>
            {selectedOptions.map((option) => (
               <div key={option.value}>
                <Row>
                    <Col md='6'><span>{option.label}</span></Col>
                    <Col md='6'>
                        <div className='form-check form-switch'>
                            <Label for='exampleCustomSwitch' className='form-check-label'>
                                Host
                            </Label>
                            <Input type='switch' name='customSwitch'  id={option.value}
                                onChange={handleSwitchChange(option)}
                                checked={switchValues[option.value] || false} />
                        </div>
                        <hr></hr>
                    </Col>
                </Row>
           </div>
            ))}
            <Button className='btn btn-primary float-right' onClick={() => handleDone()}>Done</Button>
            </>
            ) : (
                <p>No participants selected</p>
            )) : <div className='text-center'><Spinner/></div>
            }
          </Col>
        </Row>
      
      </Container>
    </Row>
  )
}

export default ParticipantsComponent