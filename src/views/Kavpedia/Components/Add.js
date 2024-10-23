import React, { useState, Fragment } from 'react'
import Select from 'react-select'
import { Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap'
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
const AddComponent = ({ CallBack, projectsDropdown, modalCancel, Api }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tags, setTags] = useState([])
  const [projects, setProjects] = useState('') 
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })
  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))
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

  const handleSubmit = async () => {
      if (searchQuery === '') {
        Api.Toast(`error`, 'Title of document is required!')
        return false
      }
      if (tags.length < 0 || tags.length === 0) {
        Api.Toast(`error`, 'Tag of document is required!')
        return false
      }
      if (files.length < 0 || files.length === 0) {
        Api.Toast(`error`, 'Document is not uploaded!')
        return false
      }
      if (searchQuery !== '' && tags.length > 0 && files.length > 0) {
        const formData = new FormData()
        let finalTags = []
        // tags should be lower letter and space replaced with '_'
        // finalTags = tags.map(item => item.toLowerCase().replace(/ /g, '_'))
        // now make array , separated string 
        finalTags = tags.join(', ')
        formData.append('title', searchQuery)
        if (projects !== '') formData.append('project', projects)
        formData.append('tags', finalTags)
        formData.append('file', files[0])
        await Api.jsonPost(`/datahive/`, formData, false).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast(`success`, 'Document is uploaded successfully!')
                    CallBack()
                } else {
                    Api.Toast(`error`, result.message)
                }
            } 
        })
      }
  }
  return (
   <Fragment>
    <Row className='justify-content-center'>
        <Col md={8} className='mb-1'>
            {/* Search Input */}
                <div className=" mb-1">
                <label>Title</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Add Title here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                   
                </div>
        </Col>
      
                <Col md='4' className='mb-1'>
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
                <Col md='8' className='mb-1'>
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
                <Col md='4' className='mb-1'>
                {files.length ? (
                        <Fragment>
                            <ListGroup className='my-2'>{fileList}</ListGroup>
                        </Fragment>
                        ) : <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                          <DownloadCloud size={24} />
                          <p className='text-secondary'>
                            Drop files here or click{' '}
                            <a href='/' onClick={e => e.preventDefault()}>
                              browse
                            </a>
                          </p>
                        </div>
                      </div>}
                </Col>
       
        <div className='d-flex mb-1 justify-content-center'>
            <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmit}>
                Save
            </button>
            <button className="btn btn-outline-danger mt-2" onClick={modalCancel}>
                cancel
            </button>
        </div>
        
    </Row>
   </Fragment>

    
  )
}

export default AddComponent
