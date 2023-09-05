import { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
const Manualpdfreader = ({file}) => {
    const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages)
        setPageNumber(1)
      }
    
      function changePage(offSet) {
        setPageNumber(prevPageNumber => prevPageNumber + offSet)
      }
    
      function changePageBack() {
        changePage(-1)
      }
    
      function changePageNext() {
        changePage(+1)
      }

return (
    <div>
      
         <center>
         <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page height="500" width="700" pageNumber={pageNumber} />
        </Document>
        <p className='mt-1'><b> Page {pageNumber} of {numPages}</b></p>
        { pageNumber > 1 && 
        <button className='btn btn-warning' onClick={changePageBack}>Previous Page</button>
        }
        {
          pageNumber < numPages &&
          <button className='btn btn-primary' onClick={changePageNext}>Next Page</button>
        }
      </center>
    </div>
)
}

export default Manualpdfreader