const { PDFDocument, StandardFonts, rgb } = PDFLib

export function modifyPdf(routeInfo) {
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
      });

      // get the text fields
      const routeField = form.getTextField('route');
      const crewField = form.getTextField('crew');
      const distancesField = form.getTextField('distances');
      const portagesIndividualField = form.getTextField('portages_individual');
      const totalPortageField = form.getTextField('total_portage');
      const totalCanoeField = form.getTextField('total_canoe');

      // fill in the text fields
      routeField.setText(routeInfo.route);
      crewField.setText(routeInfo.crew);
      distancesField.setText(routeInfo.distances);
      portagesIndividualField.setText(routeInfo.portages);
      totalPortageField.setText(routeInfo.totalPortage);
      totalCanoeField.setText(routeInfo.totalCanoe);
      console.log(form);
      form.flatten(); // convert form fields into regular text
      const pdfBytes = await pdfDoc.save(); // serialize the PDFDocument to bytes (a Uint8Array)

     
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // open in new tab

      // download(pdfBytes, "route.pdf", "application/pdf");  // trigger the browser to download the PDF document
    })
    .catch((error) => {
      console.error('Error fetching PDF: ', error);
    });
}


export async function createPdf (tripDetails) {
    const pdfDoc = await PDFDocument.create(); // create new document

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica); // embed font
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // embed font

    const page = pdfDoc.addPage(); // add new page

    const { width, height } = page.getSize(); // get width and height of page (595.28 841.89)
    console.log(width, height);
    const fontSize = 30;

    page.drawLine({ // title line
        start: { x: 70, y: 690},
        end: { x: 530, y: 690},
        thickness: 1.5,
        color: rgb(0, 0, 0), // black
        opacity: 0.25,
    })

    // add title
    const title =  `${tripDetails.type} trip to ${tripDetails.park} Park ${tripDetails.year}`.toUpperCase();

    page.drawText(
        title,
        {
            x: 110,
            y: 700,
            font: helveticaBold,
            size: 18,
            color: rgb(0, 0, 0),
            lineHeight: 24,
            opacity: 1,
        },
    )

    // embed logo
    const response = await fetch("../../src/frontend/assets/logo.png");
    const logoBytes = await response.arrayBuffer();
    const pngImage = await pdfDoc.embedPng(logoBytes);
    const pngDims = pngImage.scale(0.32);
    const marginLeft = 70;


    page.drawImage(pngImage, {
        x: marginLeft,
        y: 750,
        width: pngDims.width,
        height: pngDims.height,
    })

    // add introduction paragraph - incorporate gpt later?
    const intro = `Algonquin Provincial Park, located in Ontario, Canada, is a premier destination for backcountry camping. Renowned for its vast wilderness, this park offers a true escape into nature with over 7,600 square kilometers of forests, lakes, and rivers.  Backcountry camping in Algonquin is an immersive experience, allowing adventurers to explore a network of canoe routes and hiking trails. The park is home to a diverse array of wildlife, including moose, beavers, and numerous bird species, making it a haven for nature enthusiasts and photographers.`;
    const introHeader = 'Park';

    page.drawText(
        introHeader,
        {
            x: marginLeft,
            y: 660,
            font: helveticaBold,
            size: 16,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }
    )

    page.drawText(
        intro,
        {
            x: marginLeft,
            y: 630,
            maxWidth: 480,
            font: helveticaFont,
            size: 14,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 0.75,
        },
    )

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); // open in new tab
}