import fs from 'fs';
import csv from 'csv-parser';

// Load questions
const questions = [];

fs.createReadStream('Question.csv')
  .pipe(csv())
  .on('data', (row) => {
    questions.push({
      id: parseInt(row['Question Number']),
      question: row['Question'],
      options: {
        A: row['Option A'],
        B: row['Option B'],
        C: row['Option C'],
        D: row['Option D']
      },
      correctAnswer: row['Correct Answer']
    });
  })
  .on('end', () => {
    console.log('Testing scoring for first 5 questions:');
    console.log('=====================================');
    
    for (let i = 0; i < 5; i++) {
      const q = questions[i];
      console.log(`\nQ${q.id}: ${q.question}`);
      console.log(`Options:`);
      console.log(`  A: ${q.options.A}`);
      console.log(`  B: ${q.options.B}`);
      console.log(`  C: ${q.options.C}`);
      console.log(`  D: ${q.options.D}`);
      console.log(`Correct Answer: ${q.correctAnswer}`);
      
      // Find which option matches the correct answer
      const correctOption = Object.keys(q.options).find(key => 
        q.options[key] === q.correctAnswer
      );
      console.log(`Correct Option: ${correctOption}`);
    }
    
    // Test with sample answers
    console.log('\n\nTesting with sample answers:');
    console.log('=============================');
    
    const testAnswers = ['A', 'B', 'C', 'D', 'A']; // Sample answers
    let score = 0;
    
    for (let i = 0; i < testAnswers.length && i < questions.length; i++) {
      const userAnswer = testAnswers[i];
      const question = questions[i];
      const correctOption = Object.keys(question.options).find(key => 
        question.options[key] === question.correctAnswer
      );
      
      const isCorrect = userAnswer === correctOption;
      console.log(`Q${i+1}: User answered ${userAnswer}, Correct is ${correctOption} - ${isCorrect ? '✅' : '❌'}`);
      
      if (isCorrect) score++;
    }
    
    console.log(`\nScore: ${score}/${testAnswers.length} (${Math.round((score/testAnswers.length)*100)}%)`);
  });
