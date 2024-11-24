// src/components/extractTextFromPDF.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; // Import PDF.js for text extraction

// Set the worker source for PDF.js to the local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'; // Ensure the path is correct in your public folder

const extractTextFromPDF = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        let textContent = '';
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(' ');
          textContent += pageText + '\n';
        }

        resolve({ name: file.name, text: textContent }); // Return extracted text with file name
      } catch (error) {
        reject(`Error extracting text from PDF ${file.name}: ${error.message}`);
      }
    };

    fileReader.onerror = (error) => {
      reject(`Error reading file ${file.name}: ${error}`);
    };

    fileReader.readAsArrayBuffer(file); // Read file as ArrayBuffer for PDF.js
  });
};

export default extractTextFromPDF;
