import fs from 'fs';
import csv from 'csv-parser';

const questions = [];

fs.createReadStream('Question.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Skip header rows
    if (row['Question Number'] && row['Question Number'] !== 'வினா எண்') {
      const question = {
        id: parseInt(row['Question Number']),
        question: row['Question'],
        options: {
          A: row['Option A'],
          B: row['Option B'],
          C: row['Option C'],
          D: row['Option D']
        },
        correctAnswer: row['Correct Answer']
      };
      questions.push(question);
    }
  })
  .on('end', () => {
    // Write to questions.json
    fs.writeFileSync('src/data/questions.json', JSON.stringify(questions, null, 2));
    fs.writeFileSync('public/questions.json', JSON.stringify(questions, null, 2));
    console.log('Questions updated successfully!');
    console.log(`Total questions: ${questions.length}`);
  });
