// const { PDFDocument, StandardFonts, rgb } = PDFLib

// // creates a new pdf and converts it into a byte stream
// async function createPdf() {
//   const pdfDoc = await PDFDocument.create();
//   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

//   const page = pdfDoc.addPage();
//   const { width, height } = page.getSize();
//   const fontSize = 30;
//   page.drawText('Creating PDFs in JavaScript is awesome!', {
//     x: 50,
//     y: height - 4 * fontSize,
//     size: fontSize,
//     font: timesRomanFont,
//     color: rgb(0, 0.53, 0.71),
//   })

//   const pdfBytes = await pdfDoc.save();
  
// //   console.log(pdfBytes);
//   return pdfBytes

// }

// // converts a byte stream into a javascript blob
// function bytesToBlob (pdfBytes) {
//     const blob = new Blob([pdfBytes], {type: 'application/pdf'}); // specify MIME type


//     const blobURL = URL.createObjectURL(blob); // reference to blob object

//     return blobURL;
// }

// // Wrapper function to get PDF as a blob (binary large object)
// export function getPDFBlob() {
//     const pdfBytes = createPdf();
//     const pdfBlob = bytesToBlob(pdfBytes);

//      // Display the PDF in an iframe or another suitable HTML element
//     const iframe = document.createElement('iframe');
//     iframe.src = pdfBlob;
//     iframe.width = '100%';
//     iframe.height = '600px'; // Set the desired height
//     document.body.appendChild(iframe);

//     console.log('PDF displayed in the browser');
//     // return pdfBlob;
// }


const { PDFDocument, StandardFonts, rgb } = PDFLib

export async function createPdf() {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create()

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  // Add a blank page to the document
  const page = pdfDoc.addPage()

  // Get the width and height of the page
  const { width, height } = page.getSize()

  // Draw a string of text toward the top of the page
  const fontSize = 30
  page.drawText('Creating PDFs in JavaScript is awesome!', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()

        // Trigger the browser to download the PDF document
  download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
}