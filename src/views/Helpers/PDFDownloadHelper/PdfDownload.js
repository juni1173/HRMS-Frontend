import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DownloadPDF = () => {
  const handleDownload = (table_id, file_name) => {

    // Get the table element
    const table = document.getElementById(table_id)
    // Create a canvas from the table
    html2canvas(table).then((canvas) => {
      // Convert canvas to base64 image
      const imgData = canvas.toDataURL('image/png')

      // Create a PDF instance
      const pdf = new jsPDF()

      // Set the image width and height
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.setFontSize(12)
      pdf.text(10, 20, file_name)
  
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight)

      // Download the PDF file
      pdf.save(`${file_name}.pdf`)
    })
  }

  return {
    handleDownload
  }
}

export default DownloadPDF
