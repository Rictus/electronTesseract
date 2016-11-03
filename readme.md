# Dependencies
## Tesseract
### Linux
```bash
sudo apt-get install tesseract
```
###Windows
Download http://dylan-leroux.fr/tesseract/tesseract.zip
Extract it somewhere and add the executable path to your PATH environment variable

## Tesseract training data
Download https://github.com/tesseract-ocr/tessdata
Put these files in a directory and add this directory path in config.json

# TODO :
- Region selection
- Loading animation
- Drag and drop
- Node js server that listen requests
- More options
- Error handling : show to user
- Responsive
- Tesseract installation script
- Face recognition
- More supported mime types