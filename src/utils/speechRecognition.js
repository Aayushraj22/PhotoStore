//initialize speech recognition API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition(); //initialize my instance of speech recognition
recognition.interimResults = true; //return results while still working on current recognition
recognition.continuous = true; // Recommended for longer recordings

//once speech recognition determines it has a "result", grab the texts of that result, join all of them, and add to paragraph
// recognition.addEventListener("result", (e) => {
    
//     const transcript = Array.from(e.results)
//         .map(result => result[0])
//         .map(result => result.transcript)
//         .join("")

//         // transcript is the current spoken words in textual format

//     //once speech recognition determines it has a final result, add this value with already present value
//     //this way every time you add a new text when speaker stops, to the previous text
//     if (e.results[0].isFinal) {
//         // do something with the current spoken text
//     }

// })

//add your functionality to the start and stop buttons
function startRecording() {
    recognition.start();
    recognition.addEventListener("end", recognition.start)

}

function stopRecording() {
    recognition.removeEventListener("end", recognition.start)
    recognition.stop();
}

export {recognition, startRecording, stopRecording}