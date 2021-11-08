import PyPDF2

filename = '.files/f0b894bf491102792514d15924ed4bb0808e55a2f3fce30c6cf21e1081e2e33c'

pdf_text = []
with open(filename, 'rb') as f:
    r = PyPDF2.PdfFileReader(f)
    numPages = r.numPages
    pdfText = ['']*numPages
    for i in range(numPages):
        p = r.getPage(i)
        pdfText[i] += p.extractText()

pdfText