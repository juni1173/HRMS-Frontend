import React, { useState, Fragment } from 'react'
import { Search } from 'react-feather'
import Select from 'react-select'
import { Row, Col, Input, Button, Dropdown,
    InputGroup,
    DropdownMenu,
    DropdownItem,
    DropdownToggle } from 'reactstrap'
const SearchComponent = ({ Callback, projects }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tags, setTags] = useState([])
//   const [projects, setProjects] = useState('') 
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const toggleDropDown = () => {
//     setDropdownOpen(!dropdownOpen)
//   }
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
            <Col md='2'></Col>
            <Col md='8'>
            <InputGroup>
                    {/* <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
                        <DropdownToggle color='primary' caret outline>
                            {projects === '' ? 'Select Projects' : projectsDropdown.find(pre => pre.value === projects).label}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => setProjects('')}>
                                Select Projects
                            </DropdownItem>
                            {projectsDropdown.map(project => (
                                <DropdownItem key={project.value} onClick={() => setProjects(project.value)}>
                                    {project.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown> */}
                    <Input  
                    placeholder="Search title here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    <Input onKeyDown={handleKeyDown} type="text" placeholder="Type tag and press enter" />
                    <Button color='primary' outline onClick={handleSearch}>
                        <Search size={12}/> Search
                    </Button>
                </InputGroup>
                {tags.length > 0 && (
                    <div className="tags-input-container">
                        Tags: 
                        { tags.map((tag, index) => (
                            <div className="tag-item" key={index}>
                                <span className="text">{tag}</span>
                                <span className="close" onClick={() => removeTag(index)}>&times;</span>
                            </div>
                        )) }
                    
                    </div>
                )}
            </Col>
            <Col md='2'></Col>
        </Row>
   </Fragment>

    
  )
}

export default SearchComponent
