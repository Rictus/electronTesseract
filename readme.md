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
## Features
- Region selection
- Face recognition
- Drag and drop
## UX
- Loading animation
- Error handling : show to user
- Responsive
## Misc
- More supported mime types
- More testcases