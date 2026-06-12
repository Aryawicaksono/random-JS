const readline = require('readline-sync');
const {wordBank, stages} = require('./asset');

function display(stages, hiddenWord, clue, guessedLetters, wrongCount){
  console.log('===========================================\n');
  console.log(stages[wrongCount]);
  console.log('\n===========================================\n');
  console.log(`Clue: ${clue}`);
  console.log(`Word: ${hiddenWord.join(' ')}`);
  console.log(`Wrong Letters: [ ${guessedLetters.join(',')} ]`);
  console.log('-------------------------------------------');
}

function randomWord(wordBank){
  const randomIndex = Math.floor(Math.random() * wordBank.length);

  return wordBank[randomIndex];
}

function hiddenWord(word){
  const letter = word.split('');

  return Array(letter.length).fill('_');
}

function letterValidator(hiddenWord, guessedLetters){
  while(true){
    const letterInput = readline.question('Masukkan satu huruf: ').toLocaleUpperCase();

    if(letterInput === '' || letterInput.length !== 1){
      console.log('Input anda keliru. Tolong masukkan lagi');
      continue;
    }

    if (hiddenWord.includes(letterInput) || guessedLetters.includes(letterInput)){
      console.log('Anda sudah memasukkan karakter yang sama! Tolong ulangi kembali.')
      continue;
    }
    
    return letterInput;
  }
}

function checkWin(hiddenWord){
  return !hiddenWord.includes('_');
}

function checkLose(wrongCount, life){
  return wrongCount === life;
}

while (true){
  let wrongCount = 0;
  let wordObject = randomWord(wordBank);

  const secretWord = wordObject.word
  const clue = wordObject.clue;

  let progress = hiddenWord(secretWord);
  let guessedLetters = [];
  let isWin = false;
  let isLose = false;
  const life = stages.length - 1;

  do{
    display(stages, progress, clue, guessedLetters, wrongCount);

    console.log('');
    
    const currentGuess = letterValidator(progress, guessedLetters);

    if (secretWord.includes(currentGuess)){
      for (let i = 0; i < secretWord.length; i++){
        if (secretWord[i] === currentGuess){
          progress[i] = currentGuess;
        }
      }
      console.log('Selamat! Jawaban Anda BENAR.');
    } else {
      guessedLetters.push(currentGuess);
      wrongCount++;
      console.log(`Jawaban anda SALAH. anda masih memiliki ${life - wrongCount} kesempatan`);
    }
    isWin = checkWin(progress);
    isLose = checkLose(wrongCount, life);

  } while (!isWin && !isLose)

  display(stages, progress, clue, guessedLetters, wrongCount);

  if (isWin){
    console.log('\nSelamat!! Ande berhasil menebak kata dengan benar.');
  } else if (isLose){
    console.log(`\nGAME OVER !! kata yang benar adalah ${secretWord}`);
  }

  readline.question('\nTekan [ENTER] untuk melanjutkan game.')
}