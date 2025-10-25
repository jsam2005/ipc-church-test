import fetch from 'node-fetch';

async function testShuffle() {
  console.log('🔄 Testing Question Shuffling...\n');
  
  // Test multiple times to see if questions are shuffled
  for (let i = 1; i <= 3; i++) {
    try {
      const response = await fetch('http://localhost:3001/api/questions');
      const data = await response.json();
      
      console.log(`Test ${i} - First 5 Question IDs:`);
      const firstFive = data.questions.slice(0, 5).map(q => q.id);
      console.log(firstFive.join(', '));
      console.log('');
    } catch (error) {
      console.error(`Test ${i} failed:`, error.message);
    }
  }
  
  console.log('✅ If the question IDs are different each time, shuffling is working!');
}

testShuffle();
