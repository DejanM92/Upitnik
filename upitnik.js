let questionnaire = {
    title:"Upitnik",
    deadline:"31.12.2021",
}

window.onload = function(){
    document.querySelector("#newQuestion").addEventListener("click", createQuestionHandler)
    createQuestionHandler();
}

document.querySelector("header").innerHTML = `${questionnaire.title} - ${questionnaire.deadline}<br/><br/><hr/>`;

let questionCounter = 0;
let createQuestionHandler = () => {
    let question =``;
    question += `<br/><br/>Question ${questionCounter+1}: <input type="text" id="question${questionCounter}"/> <br/><br/>`
    
    for(let i = 0; i < 5; i++){
        question+=`Answer ${i+1}: <input type="text" id="question${questionCounter}_answer${i}"/> <br/>`;
    }

    question+=`<br/><input type="button" value="Copy" id="copyQuestion${questionCounter}" class="copyButton"/><br/><br/><hr/>`;
    

    let newElement = document.createElement("span");
    newElement.innerHTML = question;
    document.querySelector(".questions").appendChild(newElement);
    
    questionCounter++;
    
    let copyButton = document.querySelectorAll(".copyButton");
    for(let i = 0; i < copyButton.length; i++){
        document.querySelectorAll(".copyButton")[i].addEventListener("click", copyQuestionHandler)
    }
}

let copyQuestionHandler = (event) => {
    createQuestionHandler();
    
    let copyId = event.target.id.replace(/[A-z]+/, "");
    
    document.querySelector(`#question${questionCounter-1}`).value = document.querySelector(`#question${copyId}`).value
    
    for(let i = 0; i < 5; i++){
        document.querySelector(`#question${questionCounter-1}_answer${i}`).value = document.querySelector(`#question${copyId}_answer${i}`).value;
    }
}

function submitFormHandler(){
    questionnaire.questions = []

    for(let i = 0; i < questionCounter; i++){
        
        let answers = [];
        for(let j = 0; j < 5; j++){
            if(document.querySelector(`#question${i}_answer${j}`).value != ''){
                answers.push(document.querySelector(`#question${i}_answer${j}`).value);
            }
        }
        
        let question = {id:i, title:document.querySelector(`#question${i}`).value, answers:answers};
        questionnaire.questions.push(question);
        
        let result = document.querySelector("#result");
        fetch("http://projectest.xyz/api/surveys", {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(questionnaire)
        }).then(res => {
            if(res.ok) {
                result.innerHTML = "Success";
                return res.json();
            } else result.innerHTML = "ERROR"
        }).then(data => console.log(data))
        .catch(error => result.innerHTML = "ERROR");
    }
}

document.querySelector("#submit").addEventListener("click", submitFormHandler);