async function run(): Promise<void> {
  while (true) {
    console.log('8');
    await delay(10000);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error);
});
