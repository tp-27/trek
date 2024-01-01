const { PDFDocument, StandardFonts, rgb } = PDFLib
const marginLeft = 70;
const marginRight = 530;

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

    const fonts = {
        "helveticaRegular": helveticaFont,
        "helveticaBold": helveticaBold,
    }
    
    const page = pdfDoc.addPage(); // add new page
    var marginTop = 690; // starts at the bottom of the header line


    const title =  `${tripDetails.type} trip to ${tripDetails.park} Park ${tripDetails.year}`.toUpperCase(); // header title
    const intro = `Algonquin Provincial Park, located in Ontario, Canada, is a premier destination for backcountry camping. Renowned for its vast wilderness, this park offers a true escape into nature with over 7,600 square kilometers of forests, lakes, and rivers.  Backcountry camping in Algonquin is an immersive experience, allowing adventurers to explore a network of canoe routes and hiking trails. The park is home to a diverse array of wildlife, including moose, beavers, and numerous bird species, making it a haven for nature enthusiasts and photographers.`;

    await addHeader(page, pdfDoc, fonts, title); // add header 1 (first page header)
    marginTop = addIntro(page, fonts, intro, marginTop);  // add intro sec - incorporate gpt later?
    marginTop = addRoutes(page, fonts, tripDetails.dates, marginTop); // add routes section
    marginTop = addCrew(page, fonts, tripDetails.crew, marginTop); // add crew member section
    addFooter(page, fonts, "Planning Brief");
    const newPage = createPage(pdfDoc, fonts, title, "Planning Brief");

    addPageCount(pdfDoc, fonts);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); // open in new tab
}

async function createPage(pdfDoc, fonts, headerTitle, footerTitle) {
    const newPage = pdfDoc.addPage();

    await addHeader(newPage, pdfDoc, fonts, headerTitle);
    addFooter(newPage, fonts, footerTitle);
}

async function addHeader(page, pdfDoc, fonts, title) {
    const pages = pdfDoc.getPages();
    var lineMarginTop, textMarginTop, textMarginLeft;
    var fontSize;

    if (pages.length == 1) { // if main page add logo to header
        const response = await fetch("../../src/frontend/assets/logo.png");
        const logoBytes = await response.arrayBuffer();
        const pngImage = await pdfDoc.embedPng(logoBytes);
        const pngDims = pngImage.scale(0.4);
    
        // embed logo
        page.drawImage(pngImage, {
             x: marginLeft + 170,
             y: 750,
             width: pngDims.width,
             height: pngDims.height,
        })    

        fontSize = 18;
        lineMarginTop = 710;
        textMarginTop = 720;
        textMarginLeft = 110;
    } else {
        fontSize = 16;
        lineMarginTop = 770;
        textMarginTop = 780;
        textMarginLeft = 140;
    }

   
    // draw header line
    page.drawLine({ 
        start: { x: marginLeft, y: lineMarginTop},
        end: { x: marginRight, y: lineMarginTop},
        thickness: 1.5,
        color: rgb(0, 0, 0), // black
        opacity: 0.25,
    })

    // draw header text
    page.drawText( 
        title,
        {
            x: textMarginLeft,
            y: textMarginTop,
            font: fonts["helveticaBold"],
            size: fontSize,
            color: rgb(0, 0, 0),
            lineHeight: 24,
            opacity: 1,
        },
    )
}

function addFooter(page, fonts, footHeading) {
    // footer line
    page.drawLine({ 
        start: { x: marginLeft, y: 50},
        end: { x: marginRight, y: 50},
        thickness: 1.5,
        color: rgb(0, 0, 0), // black
        opacity: 0.25,
    })

    page.drawText(
        footHeading,
        {
            x: marginLeft,
            y: 25,
            font: fonts["helveticaBold"],
            size: 16,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }  
    )

   
}

function addPageCount(pdfDoc, fonts) {
    const pages = pdfDoc.getPages();
    const numPages = pages.length;

    pages.forEach(function(page, num) {
        const pageNum = "Page " + (num + 1) + " of " + numPages;
        page.drawText(
            pageNum,
            {
                x: marginLeft + 395,
                y: 25,
                font: fonts["helveticaRegular"],
                size: 12,
                color: rgb(0, 0, 0),
                lineHeight: 20,
                opacity: 1,
            }  
        )
    });
}

function addIntro(page, fonts, intro, marginTop) {
    const introHeader = "Park";

    // draw intro header
    page.drawText(
        introHeader,
        {
            x: marginLeft,
            y: 660,
            font: fonts["helveticaBold"],
            size: 16,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }
    )

    // draw intro text
    page.drawText(
        intro,
        {
            x: marginLeft,
            y: 630,
            maxWidth: 480,
            font: fonts["helveticaRegular"],
            size: 14,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 0.75,
        },
    )

    const newMarginTop = marginTop - calculateTextHeight(intro,  fonts["helveticaRegular"], 14, 20, 480);
    return newMarginTop;
}

function addRoutes(page, fonts, dates, marginTop) {
    // draw route header
    console.log("in route - margintop: " + marginTop);
    const routeHeader = "Route";
    var marginTopOffset;

    marginTopOffset = marginTop - 80; // offset for route header
    page.drawText(
        routeHeader,
        {
            x: marginLeft,
            y: marginTopOffset,
            font: fonts["helveticaBold"],
            size: 16,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }
    )

    let routeDates = "";
    let routeLakes = "";
    Object.keys(dates).forEach(key => {
        const value = dates[key];
        routeDates += `${key}` + "\n"; // add route dates to string
        routeLakes += `${value}` + "\n"; // add lakes to string
    });
    
    // draw route dates
    marginTopOffset -= 30;
    page.drawText(
        routeDates,
        {
            x: marginLeft,
            y: marginTopOffset,
            font: fonts["helveticaRegular"],
            size: 14,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }
    )

    // draw lakes text
    page.drawText(
        routeLakes,
        {
            x: marginLeft + 70,
            y: marginTopOffset,
            maxWidth: 100,
            font: fonts["helveticaRegular"],
            size: 14,
            color: rgb(0, 0, 0),
            lineHeight: 20,
            opacity: 1,
        }
    )

    const numberOfKeys = Object.keys(dates).length;
    const heightSection = numberOfKeys * 20 // line height;
    console.log(heightSection);

    const newMarginTop = marginTopOffset - 100;
    // const newMarginTop = marginTop - calculateTextHeight(routeLakes,  fonts["helveticaRegular"], 14, 20, 100);
    return newMarginTop;
}

function addCrew(page, fonts, crew, marginTop) {
    const positions = "Bow" + "\n" + "Midship" + "\n" + "Stern";
    const lineHeight = 24;
    var isNewRow = -1;

    const marginHeader = marginTop - 30;
    page.drawText( // draw crew header
        "Crew",
        {
            x: marginLeft,
            y: marginHeader, // 710 
            font: fonts["helveticaBold"],
            size: 16,
            color: rgb(0, 0, 0),
            lineHeight: lineHeight,
            opacity: 1,
        },
    )

    // add position headers
    page.drawText( // draw boat column headers
        positions,
        {
            x: marginLeft,
            y: marginHeader - 50, // 710 
            font: fonts["helveticaBold"],
            size: 14,
            color: rgb(0, 0, 0),
            lineHeight: lineHeight,
            opacity: 1,
        },
    )

    let shiftLeft = marginLeft + 100;
    var colHeaderTop = marginHeader - 50;
    Object.keys(crew).forEach(boat => {
        const maxWidthName = findLongestName(crew[boat], fonts["helveticaRegular"], 14);
        let colItemMarginTop = colHeaderTop;

        if ((shiftLeft + maxWidthName) > marginRight) { // if column overflows right margin
            shiftLeft = marginLeft + 100; // reset left margin
            colHeaderTop -= 3 * lineHeight + 20;  // shift down the height of the above columns x max amount of members

            page.drawText( // draw boat column headers
                positions,
                {
                    x: marginLeft,
                    y: colHeaderTop, // 710 
                    font: fonts["helveticaBold"],
                    size: 14,
                    color: rgb(0, 0, 0),
                    lineHeight: lineHeight,
                    opacity: 1,
                },
            )
        }

        page.drawText( // draw boat column headers
            boat,
            {
                x: shiftLeft,
                y: colHeaderTop, // 710 
                font: fonts["helveticaBold"],
                size: 14,
                color: rgb(0, 0, 0),
                lineHeight: lineHeight,
                opacity: 1,
            },
        )
        
        colItemMarginTop = colHeaderTop - 20;  // shift down to write names for each boat

        Object.keys(crew[boat]).forEach(member => { // for each member from a boat
            page.drawText( // draw boat column names
                member,
                {
                    x: shiftLeft,
                    y: colItemMarginTop, 
                    font: fonts["helveticaRegular"],
                    size: 14,
                    color: rgb(0, 0, 0),
                    lineHeight: lineHeight,
                    opacity: 1,
                },
            )

            colItemMarginTop -= 20; // shift down for next name
        })

       
        shiftLeft += maxWidthName + 30; // shift by longest name plus some more
    })
}


// returns the width of the longest name 
function findLongestName(crew, font, fontSize) {
    var maxWidth = 0;

    Object.keys(crew).forEach(member => {
        const length =  font.widthOfTextAtSize(member, fontSize);
        if (length > maxWidth) {
            maxWidth = length;
        }
    })

    return maxWidth;
}


function calculateTextHeight(text, font, fontSize, lineHeight, maxWidth) {
    const words = text.split(' ');
    let line = '';
    let numberOfLines = 0;

    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = font.widthOfTextAtSize(testLine, fontSize);
        if (metrics > maxWidth && line.length > 0) {
            line = word + ' ';
            numberOfLines++;
        } else {
            line = testLine;
        }
    });

    if (line.length > 0) {
        numberOfLines++;
    }

    const textHeight = numberOfLines * lineHeight;
    return textHeight;
}
