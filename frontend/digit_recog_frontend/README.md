# Digit Recognition Project
This is a React+Vite+Tailwindcss project which implements a web page to gather the user-entered input
and call the pre-build model in python to make a prediction of what digit the user is entering. 

## Project Structure
```              
├── App.jsx (Connect component Welcome and DrawingBoard together)
│
├──DrawingBoard.jsx (The major react code which implements the logic of the canvas and processing predictions)
│                             
├── index.css (Contains the basic css code for tailwind to use. It decides the style of the website)
│
├── main.jsx (Root file, render App.jsx)
│
├── model.onnx (The digit recoginition model that the website will call on to make predictions)
│
└── Welcome.jsx (The welcome page. Simply gives a title and an introduction of the project. )
```

## Running the Project
1. <b>Install Dependencies</b>: Run npm install to install required dependencies. 
2. <b>Launch the Project<\b>: Run npm run dev to run the project locally
Note: the project will be run on port 82. 