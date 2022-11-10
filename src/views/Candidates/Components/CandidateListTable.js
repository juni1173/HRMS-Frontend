import { Input, Col} from  "reactstrap"

const CandidateListTable = () => {
    return (
           <div>
                <table className="table ">
                    <thead>
                        <tr>
                            <th>
                            <Col md='12' className='mb-1'>
                                <Input
                                type="checkbox"
                                id="ckbox"
                                />
                            </Col>
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Job title</th>
                            <th>APPLICATION Created at</th>
                            <th>Score</th>
                            <th>Stage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                            <Col md='12' className='mb-1'>
                                <Input
                                    type="checkbox"
                                    id="dd"
                                    />
                            </Col>
                            </td>
                            <td>Jorge Eden</td>
                            <td>jorge@gmail.com</td>
                            <td>Sales Manager</td>
                            <td>Oct 23</td>
                            <td> </td>
                            <td>Phone Scree</td>
                        </tr>
                        <tr>
                        <td>
                            <Col md='12' className='mb-1'>
                                <Input
                                    type="checkbox"
                                    id="dd"
                                    />
                            </Col>
                            </td>
                            <td>Eden</td>
                            <td>Eden@gmail.com</td>
                            <td>Sales Manager</td>
                            <td>Oct 23</td>
                            <td> </td>
                            <td>Phone Scree</td>
                        </tr>
                        
                        
                    </tbody>
               </table>
            </div>
    )
}
export default CandidateListTable