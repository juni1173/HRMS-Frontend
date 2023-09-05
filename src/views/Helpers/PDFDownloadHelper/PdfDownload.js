import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DownloadPDF = () => {
  const handleDownload = async (table_id, file_name) => {

    // Get the table element
    window.scrollTo(0, 0)
    const table = document.getElementById(table_id)
    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 190
      const pageHeight = 290
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      const doc = new jsPDF('pt', 'mm')
      doc.setFontSize(12)
      doc.text(10, 20, file_name)
      let position = 0
      doc.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight + 25)
      heightLeft -= pageHeight
      while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 25)
          heightLeft -= pageHeight
      }
      doc.save(`${file_name}.pdf`)
  })
  
  //   const pdf = new jsPDF({ unit: "px", format: "letter", userUnit: "px" })
  //  pdf.html(table, { html2canvas: { scale: 0.47 } }).then(() => {
  //    pdf.save(`${file_name}.pdf`)
  //  })
    // Create a canvas from the table
    // html2canvas(table).then((canvas) => {
    //   // Convert canvas to base64 image
    //   // const imgData = canvas.toDataURL('image/png')
    // //   const totalHeight = table.clientHeight
    // //   // Create a PDF instance
    // //   const pdf = new jsPDF()

    // //   // Set the image width and height
    // //   const pageWidth = pdf.internal.pageSize.getWidth()
    // // const pageHeight = pdf.internal.pageSize.getHeight()
    // // let position = 0
    // //   const imgWidth = pdf.internal.pageSize.getWidth()
    // //   const imgHeight = (canvas.height * imgWidth) / canvas.width
    // //   pdf.setFontSize(12)
    // //   pdf.text(10, 20, file_name)
    // //   const capturePage = async (scrollY) => {
    // //     const canvas = await html2canvas(table, {
    // //       windowWidth: pageWidth,
    // //       windowHeight: pageHeight,
    // //       scrollY
    // //     })
    // //     return canvas.toDataURL('image/png')
    // //   }
    // //   let imgData = capturePage(position)
    // //     imgData = canvas.toDataURL(imgData)
    // //     pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight)
    // //   while (position < imgHeight) {
    // //     if (position > 0) pdf.addPage()
    // //     position = position + pageHeight
    // //   }
    //   // Add the image to the PDF
    //   // pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight)

    //   // Download the PDF file
    //   pdf.save(`${file_name}.pdf`)
    // })
  }

  return {
    handleDownload
  }
}

export default DownloadPDF
