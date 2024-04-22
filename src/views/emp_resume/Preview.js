import React from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody
} from 'reactstrap'
import html2pdf from 'html2pdf.js'
// import { EditorState, convertFromHTML, ContentState } from 'draft-js'
const Preview = ({name, location, mobile, email, summary, accomplishments, experiences, educations}) => {
    const generatePdf = () => {
        const element = document.getElementById('resume')
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'png', quality: 1.5 },
          html2canvas: { scale: 2 }, // Adjust the scale for better resolution
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } 
        html2pdf(element, options)
      }
    return (
    <Container>
      {/* {isSubmitted && ( */}
        <Card className="mt-4" id='resume'>
          <CardBody>
            <div className="text-center fs-4">
  <strong>{name}</strong>
</div>

            <div  className="text-center">
              {location} ; Mobile:{mobile} ; Email:{email}
            </div>
            <div className='fs-4'>
              <strong>Summary</strong>
            </div>
            <div>{summary}</div>
            <div className='fs-4'>
              <strong>ACCOMPLISHMENTS:</strong>
            </div>
            {accomplishments.map((item, index) => (
              <div key={index}>
                <div>
                  <strong>{item.company}:</strong> {item.accomplishment}
                </div>
              </div>
            ))}
            <div className='fs-4'>
              <strong>PROFESSIONAL EXPERIENCE</strong>
            </div>
            {experiences.map((experience, index) => (
      <div key={index}>
       <div className="d-flex justify-content-between align-items-center">
  <strong className="text-center fs-4">{experience.company}</strong>
  <strong>{experience.startDate} - {experience.endDate}</strong>
</div>
        <div>
         {experience.title}
        </div>
        
        <div>
        {experience.points && (
  <div>
    {console.log('points', experience.points)}
    <div dangerouslySetInnerHTML={{ __html: experience.points }} />
  </div>
)}

          {/* <ul>
            {experience.points.map((point, pointIndex) => (
              <li key={pointIndex}>{point}</li>
            ))}
          </ul> */}
        </div>
      </div>
    ))}
            <div className='fs-4'>
              <strong>EDUCATION & COURSES</strong>
            </div>
            {educations.map((education, index) => (
              <div key={index}>
        <div>
         
        </div>
        <div className="d-flex justify-content-between align-items-center">
        <strong>{education.university}</strong>
  <strong>{education.startDate} - {education.endDate}</strong>
</div>
        <div>
           {education.degree}
        </div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Button onClick={generatePdf} color="success" className='mr-1'>
                                            Generate pdf
                                        </Button>
      {/* )} */}
    </Container>
  )
}

export default Preview
