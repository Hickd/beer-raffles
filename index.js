const inquirer = require('inquirer');
const fs = require('fs');
const enterSweep = require('./enter.js');
const csv = require('csv-parser');

class info {
constructor(FIRSTNAME, LASTNAME, EMAIL) {

this.FIRSTNAME = FIRSTNAME;
this.LASTNAME = LASTNAME;
this.EMAIL = EMAIL;

}
}

const homepage = {

type: 'list',
name: 'homepage',
message: 'Would you like to start?',
choices: ['Start', 'Exit']

}

const startProgram = async () => {

inquirer.prompt(homepage).then(answers => {

if (answers.homepage === 'Start') {

  console.clear();

let tasks = [];

fs.createReadStream('profiles.csv')
.pipe(csv())
.on('data', (row) => {

    tasks.push(new info(
        row.FIRSTNAME,
        row.LASTNAME,
        row.EMAIL
));
})
.on('end', () => {

    let numberOfTasks = tasks.length;

for (let i = 0; i < numberOfTasks; i++) {


  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `***ENTER CHATGPT API KEY HERE***`
    },
    body: JSON.stringify({
      messages:  [
        {
          "role": "user",
          "content": "do not mention you are an ai language model in your answer to the following prompt - Give me a random answer to - what are your plans for the king's coronation? Answer as if you are british, be specific."
        }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 150,
      n: 1,
      stop: '\n',
      temperature: 0.8,
      frequency_penalty: 0.5,
      presence_penalty: 0.3
    })
  })
    .then(response => {
      return response.json();
    }).then (data => {
  
  let responseText = data.choices[0].message.content;


enterSweep(tasks[i].FIRSTNAME, tasks[i].LASTNAME, tasks[i].EMAIL, responseText);

setTimeout(() => {

}, 4000);



    })
    .catch(error => {
      console.error(error);
    });



}
});

}
else {

    process.exit();

}



});

}

startProgram();