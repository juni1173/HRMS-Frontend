import {React, useState, useEffect} from 'react'
import { Col, Card, Table, CardHeader, CardTitle, Input, Spinner, Label } from 'reactstrap'
import Select from 'react-select'
import { read } from 'xlsx'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'
import PositionHelper from '../../Helpers/PositionHelper'
import apiHelper from '../../Helpers/ApiHelper'
const QuestionsList = () => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [type, setType] = useState(2)
    const [positionValue, setPositionValue] = useState(null)
    const [positionActive] = useState([])
    const [positionNotActive] = useState([])
    const [searchQuery] = useState([])
    const [exportPath, setExportPath] = useState(null)
   const searchHelper = SearchHelper()
   const Position = PositionHelper()
   const Api = apiHelper()
   const typeDropdown = [
    { value: '2', label: 'Non-Technical' },
    { value: '1', label: 'Technical' }
  ]
   const fetchPositions = (data) => {
    setLoading(true)
      if (data.position.length > 0) {
        setLoading(true)
        positionActive.splice(0, positionActive.length)
        positionNotActive.splice(0, positionNotActive.length)
        if (Object.values(data.position).length > 0) {
            for (let i = 0; i < data.position.length; i++) {
                if (data.position[i].is_active) {
                  positionActive.push({value: data.position[i].id, label: data.position[i].title})
                } else {
                  positionNotActive.push({value: data.position[i].id, label: data.position[i].title})
                }
              }  
        }
      } 
      setLoading(false)
}
const getQuestions = async (paperType, quesPosition = null) => {
    setLoading(true)
      const formData = new FormData()
      if (paperType) {
          formData['assessment_type'] = paperType
      }
      formData['position'] = quesPosition
      await Api.jsonPost(`/assessments/list/questions/all/`, formData).then(result => {
          if (result) {
              if (result.status === 200) {
                  const list = result.data
                  if (list.length > 0) {
                     setQuestions(list)
                     setSearchResults(list)
                     setExportPath(process.env.REACT_APP_BACKEND_URL + result.file_data.assessment_file)
                  } else {
                      Api.Toast('error', 'No Question Data Available For This Type/Position')
                  }
              } else {
                  Api.Toast('error', result.message)
                  setQuestions([])
                  setSearchResults([])
                  setExportPath(null)
              }
          } else {
              Api.Toast('error', 'Something Went Wrong')
          }
      })
      setTimeout(() => {
          setLoading(false)
      }, 500)
     
  }
    const handleImport = async ($event) => {
        const files = $event.target.files
        setLoading(true)

        if (files.length) {
            const file = files[0]
            // const reader = new FileReader()
            // reader.onload = (event) => {
            //     const wb = read(event.target.result)
                
            //     const sheets = wb.SheetNames
            //     if (sheets.length) {
            //         const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
            //         console.warn(rows)
            //     }
            // }
            // reader.readAsArrayBuffer(file)
            // $event.target.files = null
            const formData = new FormData()

            formData.append('assessment_type', type)
            if (positionValue !== null) {
                formData.append('position', positionValue)
            }
            formData.append('assessment_file', file)
            await Api.jsonPost(`/assessments/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                            const wb = read(event.target.result)
                            
                            const sheets = wb.SheetNames
                            if (sheets.length) {
                                // const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                                // console.warn(rows)
                               getQuestions(type, positionValue)
                            }
                        }
                        reader.readAsArrayBuffer(file)
                        $event.target.files = null
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Something Went wrong')
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }
    
    // const handleExport = () => {
    //     const headings = [
    //         [
    //         'Question',
    //         'Option1',
    //         'Option2',
    //         'Option3',
    //         'Option4',
    //         'Answer',
    //         'CLevel',
    //         'Time'
    //         ]
    //     ]
    //     const wb = utils.book_new()
    //     const ws = utils.json_to_sheet([])
    //     utils.sheet_add_aoa(ws, headings)
    //     utils.sheet_add_json(ws, questions, { origin: 'A2', skipHeader: true })
    //     utils.book_append_sheet(wb, ws, 'Report')
    //     writeFile(wb, 'Questions Paper.xlsx')
    // }
    const fetchPosition = () => {
        Position.fetchPositions()
        .then(data => {
          fetchPositions(data)
        })
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
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setSearchResults(searchHelper.searchObj(options))
        }
    }
    const typeSelection = (typeValue) => {
        console.warn(typeValue)
        if (typeValue === '2') {
            setPositionValue(null)
            getQuestions(typeValue)
        }
        setType(typeValue)
    }
    const positionSelection = (Value) => {
        setLoading(true)
        setPositionValue(Value)
        getQuestions(type, Value)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    useEffect(() => {
        setLoading(true)
           fetchPosition()
           getQuestions(type)
        setLoading(false)
      }, [])
    return (
        <>
             <div className="row">
                <div className="col-md-6 float-left my-1">
                    <Label className='form-label' for={`type`}>
                      Select Type
                    </Label>
                    <Select
                    isClearable={false}
                    id="dep-status"
                    className='react-select'
                    classNamePrefix='select'
                    options={typeDropdown}
                    defaultValue={typeDropdown[0]} 
                    onChange={result => typeSelection(result.value)}
                    >  
                    </Select>
                        
                </div>
                <div className="col-md-6 float-right my-auto">
                {type === '1' && (
                        <>
                            <Label className='form-label' for={`position`}>
                            Select Position
                            </Label>
                            <Select
                            isClearable={false}
                            id="positionDropdown"
                            className='react-select'
                            classNamePrefix='select'
                            options={positionActive}
                            onChange={result => positionSelection(result.value)}
                            >  
                            </Select>
                        </>
                    )
                }
                    
                </div>
            </div>
           
          <Col sm='12'>
            
            <Card>
              <CardHeader className='justify-content-between flex-wrap questions-table-header'>
                <CardTitle tag='h4'></CardTitle>
                
                <div className='row'>
                    <div className='col-lg-4'>
                        <div className="input-group">
                            <div className="custom-file">
                                <label className="custom-file-label" htmlFor="inputGroupFile">Import file (.csv utf-8)</label>
                                {!loading ?  <input type="file" name="file" className="form-control" id="inputGroupFile" required onChange={handleImport}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> : '  loading...'} 
                            
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                    <label className="custom-file-label" htmlFor="inputGroupFile">Search</label>
                        <div className='d-flex align-items-center justify-content-end'>
                            <Input id='search-input' placeholder='search question...' type='text' bsSize='md' onChange={e => { getSearch({list: questions, key: 'question', value: e.target.value }) } } />
                        </div>
                    </div>
                    <div className='col-lg-4 my-1'>
                    <a href={exportPath && exportPath} target="_blank" rel="noopener noreferrer" download>
                        <button className="btn btn-primary float-right">
                            Export <i className="fa fa-download"></i>
                        </button>
                    </a>  
                    </div>
                </div>
              </CardHeader>

               <Table bordered striped responsive>
                    <thead className='table-dark text-center'>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Question</th>
                            <th scope="col">Option1</th>
                            <th scope="col">Option2</th>
                            <th scope="col">Option3</th>
                            <th scope="col">Option4</th>
                            <th scope="col">Answer</th>
                            <th scope="col">CLevel</th>
                            <th scope="col">TIME (Sec)</th>
                        </tr>
                    </thead>
                    <tbody> 
                            { !loading ? (
                                searchResults.length ? searchResults.map((question, index) => (
                                    <tr key={index}>
                                        <th scope="row">{ index + 1 }</th>
                                        <td>{ question.question }</td>
                                        <td>{ question.question_options[0].value}</td>
                                        <td>{ question.question_options[1].value}</td>
                                        <td>{ question.question_options[2].value }</td>
                                        <td>{ question.question_options[3].value }</td>
                                        <td>{ question.answer }</td>
                                        <td>{ question.clevel }</td>
                                        <td>{ question.time }</td>
                                    </tr> 
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">No Questions Found.</td>
                                    </tr> 
                                )
                            ) : (
                                <tr>
                                <td colSpan="9" className="text-center"><Spinner /></td>
                            </tr> 
                            )
                            }
                    </tbody>
                </Table>
            </Card>
          </Col>
        </>
    )
}

export default QuestionsList