window.jsPDF = window.jspdf.jsPDF;

export async function generatePDF() {
  // Create a PDF instance
  const pdf = new jsPDF();

  // Add content to the first page
  pdf.text("Hello, this is page 1", 20, 30);

  // Add content to the second page
  pdf.addPage();
  pdf.text("Hello, this is page 2", 20, 30);

  // Convert the entire document to an image and add it to the PDF
  convertDocumentToImage(pdf);
}

function convertDocumentToImage(pdf) {
    const mapElement = document.getElementById("map");
  // Convert the document to an image using html2canvas
  html2canvas(mapElement).then(canvas => {
    // Convert the canvas to an image data URI
    const imageDataURI = canvas.toDataURL("image/png");

    // Add the image to the PDF using addImage method
    pdf.addImage(imageDataURI, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height/2);

    // Save the PDF
    pdf.save('example.pdf');
  });
}