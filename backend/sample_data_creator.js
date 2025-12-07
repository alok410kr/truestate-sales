/**
 * Create a sample dataset from the full CSV
 * Run this to create a smaller dataset for deployment
 */

const fs = require("fs");
const readline = require("readline");

async function createSampleData() {
  const inputFile = "../truestate_assignment_dataset.csv";
  const outputFile = "./sample_data.csv";
  const sampleSize = 10000; // Number of records to include

  const readStream = fs.createReadStream(inputFile);
  const writeStream = fs.createWriteStream(outputFile);

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let writtenCount = 0;

  for await (const line of rl) {
    if (lineCount === 0) {
      // Always write header
      writeStream.write(line + "\n");
      writtenCount++;
    } else if (lineCount <= sampleSize) {
      writeStream.write(line + "\n");
      writtenCount++;
    } else {
      break;
    }
    lineCount++;
  }

  writeStream.end();

}

createSampleData().catch(console.error);
