import React, { useState, Fragment } from 'react'
import Select from 'react-select'
import { Row, Col } from 'reactstrap'
const SearchComponent = ({ Callback, projectsDropdown }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tags, setTags] = useState([])
  const [projects, setProjects] = useState('')
  const [showFilters, setShowFilters] = useState(false)    
//   const [tagInput, setTagInput] = useState('')
  function handleKeyDown(e) {
    // If user did not press enter key, return
    if (e.key !== 'Enter') return
    // Get the value of the input
    const value = e.target.value
    // If the value is empty, return
    if (!value.trim()) return
    // Add the value to the tags array
    setTags([...tags, value])
    // Clear the input
    e.target.value = ''
}

  function removeTag(index) {
        setTags(tags.filter((el, i) => i !== index))
    }

  const handleSearch = () => {
    // let finalTags = []
    // tags should be lower letter and space replaced with '_'
    // finalTags = tags.map(item => item.toLowerCase().replace(/ /g, '_'))
    // now make array , separated string 
    Callback({
        searchQuery,
        tags,
        projects
      })
  }
  return (
   <Fragment>
    <Row className='justify-content-center'>
        <Col md={showFilters ? '3' : '7'} className='mb-1'>
            {/* Search Input */}
                <div className=" mb-1">
                <label>Search Document</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Search here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                   
                </div>
        </Col>
        {showFilters && (
            <>
                <Col md='3' className='mb-1'>
                    {/* Projects Dropdown */}
                    <div className="">
                        <label>Projects</label>
                        <Select
                            className="react-select"
                            options={projectsDropdown}
                            onChange={(e) => setProjects(e.value)}
                        />
                    </div>
                </Col>
                <Col md='4' className='mb-1'>
                    {/* Tags Filter */}
                    <div className="tags-input-container">
                        { tags.map((tag, index) => (
                            <div className="tag-item" key={index}>
                                <span className="text">{tag}</span>
                                <span className="close" onClick={() => removeTag(index)}>&times;</span>
                            </div>
                        )) }
                        <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Type tag and press enter" />
                    </div>
                </Col>
        </>
        )}
        <Col md='1' className='mb-1'>
            <button className="btn btn-primary mt-2" onClick={handleSearch}>
            Search
            </button>
        </Col>
        {!showFilters && (
            <Col md='2' className='mb-1'>
                <button className="btn btn-primary mt-2" onClick={() => setShowFilters(!showFilters)}>
                Advance Search
                </button>
            </Col>
        )}
    </Row>
   </Fragment>

    
  )
}

export default SearchComponent
