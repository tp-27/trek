const { PDFDocument, StandardFonts, rgb } = PDFLib

export async function modifyPdf(routeInfo) {
  // load existing pdf
  const pathToPdf = '../../src/frontend/assets/itinerary.pdf';

  // fetch and convert pdf to an array of bytes
  fetch(pathToPdf)
    .then((response) => response.arrayBuffer())
    .then(async (arrayBuffer) => {
      const pdfDoc = await PDFDocument.load(arrayBuffer); // load pdf

      const form = pdfDoc.getForm();
      const fields = form.getFields();
      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${type}: ${name}`);
      });

      // get the text fields
      const routeField = form.getTextField('route');
      const crewField = form.getTextField('crew');
      const distancesField = form.getTextField('distances');
      const portagesIndividualField = form.getTextField('portages_individual');
      const totalPortageField = form.getTextField('total_portage');
      const totalCanoeField = form.getTextField('total_canoe');


      // fill in the text fields
      console.log(routeInfo);
      routeField.setText(routeInfo.route);
      crewField.setText(routeInfo.crew);
      distancesField.setText(routeInfo.distances);
      portagesIndividualField.setText(routeInfo.portages);
      totalPortageField.setText(routeInfo.totalPortage);
      totalCanoeField.setText(routeInfo.totalCanoe);

      const pdfBytes = await pdfDoc.save(); // serialize the PDFDocument to bytes (a Uint8Array)

      // download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");  // trigger the browser to download the PDF document
    })
    .catch((error) => {
      console.error('Error fetching PDF: ', error);
    });


}