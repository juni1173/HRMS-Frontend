import {React, useState} from 'react'
import { Card, CardBody, Table } from 'reactstrap'
import { read, utils, writeFile } from 'xlsx'
const QuestionsList = () => {
    const [questions, setQuestions] = useState([])
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
            'Position'
            ]
        ]
        const wb = utils.book_new()
        const ws = utils.json_to_sheet([])
        utils.sheet_add_aoa(ws, headings)
        utils.sheet_add_json(ws, questions, { origin: 'A2', skipHeader: true })
        utils.book_append_sheet(wb, ws, 'Report')
        writeFile(wb, 'Questions Report.xlsx')
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
            <Card>
                <CardBody>
                    <div className="row">
                    <div className="col-sm-12">
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
                                    <th scope="col">Position</th>
                                </tr>
                            </thead>
                            <tbody> 
                                    {questions.length ? questions.map((question, index) => (
                                            <tr key={index}>
                                                <th scope="row">{ index + 1 }</th>
                                                <td>{ question.Question }</td>
                                                <td>{ question.Option1 }</td>
                                                <td>{ question.Option2 }</td>
                                                <td>{ question.Option3 }</td>
                                                <td>{ question.Option4 }</td>
                                                <td>{ question.Answer }</td>
                                                <td>{ question.Clevel }</td>
                                                <td>{ question.Position }</td>
                                            </tr> 
                                        )) : (
                                            <tr>
                                                <td colSpan="9" className="text-center">No Questions Found.</td>
                                            </tr> 
                                        )
                                    
                                    }
                            </tbody>
                        </Table>
                    </div>
                    </div>
                </CardBody>
            </Card>
            
        </>

    )
}

export default QuestionsList