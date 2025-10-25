import fs from 'fs';
import csv from 'csv-parser';

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
    fs.writeFileSync('src/data/questions.json', JSON.stringify(questions, null, 2));
    console.log('✅ Questions converted to JSON successfully!');
    console.log(`📊 Total questions: ${questions.length}`);
  });
