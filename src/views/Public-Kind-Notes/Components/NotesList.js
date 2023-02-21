import React, { Fragment, useState, useEffect } from 'react'
import { InputGroup, Container, Card, CardBody, CardTitle, CardSubtitle, CardText, InputGroupText, Col, Input } from 'reactstrap'
import { Search } from 'react-feather'
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'

const NotesList = ({ data }) => {
  const searchHelper = SearchHelper()
  const [searchResults, setSearchResults] = useState(data)
  const [searchQuery] = useState([])

  const [currentItems, setCurrentItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 6

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

  useEffect(() => {
    const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
    setCurrentItems(searchResults.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(searchResults.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, data])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % searchResults.length
    setItemOffset(newOffset)
  }
  return (
    <Fragment>
      <Container>
        <div className='row  my-1'>
            <Col md={6}>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                        <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='Search Reciever Name...'  onChange={e => { getSearch({list: data, key: 'reciever_name', value: e.target.value }) } }/>
                </InputGroup>
            </Col>
            <Col md={6}>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                        <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='Search Sender Name...'  onChange={e => { getSearch({list: data, key: 'sender_name', value: e.target.value }) } }/>
                </InputGroup>
            </Col>
          </div>
      </Container>
      {Object.values(currentItems).length > 0 ? (
        <>
          <Container>
            <Masonry className="row js-animation">
              {currentItems.map((item, key) => (
                  <Col md={6} key={key}>
                    <Card>
                    <CardBody>
                    <CardTitle tag='h4'>{item.reciever_name ? item.reciever_name : 'N/A'}
                    </CardTitle>
                        <CardSubtitle className='text-muted mb-1'>By {item.sender_name ? item.sender_name : 'N/A'}</CardSubtitle>
                        <CardText>
                        {item.notes ? item.notes : 'N/A'}
                        </CardText>
                    </CardBody>
                    </Card>
                  </Col>
                )) }
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
        </>
      ) : (
        <Card>
          <CardBody>
            <p>No Notes Found!</p>
          </CardBody>
        </Card>
      )}
    </Fragment>
  )
}

export default NotesList