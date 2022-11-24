import {React, useState} from 'react'
import { Col, Card, Table, CardHeader, CardTitle, Input } from 'reactstrap'
import { read, utils, writeFile } from 'xlsx'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'
const QuestionsList = () => {

    const [questions, setQuestions] = useState([])
    const [searchResults, setSearchResults] = useState([])
    // const [deleteModal, setDeleteModal] = useState(false)  
    const [searchQuery] = useState([])
   const searchHelper = SearchHelper()
    const handleImport = ($event) => {
        const files = $event.target.files
        if (files.length) {
            const file = files[0]
            const reader = new FileReader()
            reader.onload = (event) => {
                const wb = read(event.target.result)
                const sheets = wb.SheetNames

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                    setQuestions(rows)
                    setSearchResults(rows)
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }
    const handleExport = () => {
        const headings = [
            [
            'Question',
            'Option1',
            'Option2',
            'Option3',
            'Option4',
            'Answer',
            'CLevel',
            'Category'
            ]
        ]
        const wb = utils.book_new()
        const ws = utils.json_to_sheet([])
        utils.sheet_add_aoa(ws, headings)
        utils.sheet_add_json(ws, questions, { origin: 'A2', skipHeader: true })
        utils.book_append_sheet(wb, ws, 'Report')
        writeFile(wb, 'Questions Paper.xlsx')
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
    return (
        <>
             <div className="row">
                <div className="col-md-6 float-left">
                    <div className="input-group my-1">
                        <div className="custom-file">
                        <label className="custom-file-label" htmlFor="inputGroupFile">Import file</label>
                            <input type="file" name="file" className="form-control" id="inputGroupFile" required onChange={handleImport}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-6 float-right my-auto">
                    <button onClick={handleExport} className="btn btn-primary float-right">
                        Export <i className="fa fa-download"></i>
                    </button>
                </div>
            </div>
           
          <Col sm='12'>
            <Card>
              <CardHeader className='justify-content-between flex-wrap'>
                <CardTitle tag='h4'></CardTitle>
                <div className='d-flex align-items-center justify-content-end'>
                  <Input id='search-input' placeholder='search question...' type='text' bsSize='sm' onChange={e => { getSearch({list: questions, key: 'Question', value: e.target.value }) } } />
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
                            <th scope="col">Category</th>
                        </tr>
                    </thead>
                    <tbody> 
                            {searchResults.length ? searchResults.map((question, index) => (
                                    <tr key={index}>
                                        <th scope="row">{ index + 1 }</th>
                                        <td>{ question.Question }</td>
                                        <td>{ question.Option1 }</td>
                                        <td>{ question.Option2 }</td>
                                        <td>{ question.Option3 }</td>
                                        <td>{ question.Option4 }</td>
                                        <td>{ question.Answer }</td>
                                        <td>{ question.Clevel }</td>
                                        <td>{ question.Category }</td>
                                    </tr> 
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">No Questions Found.</td>
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