import { Input, Col} from  "reactstrap"

const CandidateListTable = (props) => {
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

                    {Object.values(props.data).length > 0 ? (
                        props.data.map((candidate, index) => (
                            <tr key={index}>
                                <td>
                                <Col md='12' className='mb-1'>
                                    <Input
                                        type="checkbox"
                                        id="dd"
                                        />
                                </Col>
                                </td>
                                <td>{candidate.candidate_name}</td>
                                <td>{candidate.email}</td>
                                <td>Sales Manager</td>
                                <td>Oct 23</td>
                                <td> </td>
                                <td>Phone Scree</td>
                            </tr>
    
                        ))
                    ) : (
                        <tr className="text-center">
                            <td colSpan={7}> No Data Available</td>
                        </tr>
                    )}
                    
                       
                    </tbody>
               </table>
            </div>
    )
}
export default CandidateListTable