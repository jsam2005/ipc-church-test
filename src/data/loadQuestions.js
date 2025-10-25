import fs from 'fs';
import csv from 'csv-parser';

export async function loadQuestionsFromCSV() {
  return new Promise((resolve, reject) => {
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
        resolve({
          questions: questions,
          testDuration: 15 // 15 minutes
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
