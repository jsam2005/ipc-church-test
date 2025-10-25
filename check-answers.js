import fs from 'fs';
import csv from 'csv-parser';

const questions = [];

fs.createReadStream('Question.csv')
  .pipe(csv())
  .on('data', (row) => {
    questions.push({
      id: row['Question Number'],
      correct: row['Correct Answer']
    });
  })
  .on('end', () => {
    console.log('Correct Answers:');
    questions.forEach(q => {
      console.log(`Q${q.id}: ${q.correct}`);
    });
  });
