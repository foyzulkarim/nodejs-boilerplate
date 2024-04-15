#!/usr/bin/env zx

// Function to create the domain structure
const createDomain = async (domainName) => {
  cd(`src/domains`);
  await $`mkdir ${domainName}`;

  // Create the files
  await Promise.all([
    $`touch ${domainName}/api.js`,
    $`touch ${domainName}/event.js`,
    $`touch ${domainName}/index.js`,
    $`touch ${domainName}/request.js`,
    $`touch ${domainName}/schema.js`,
    $`touch ${domainName}/service.js`,
  ]);
};

// Main interaction loop
const main = async () => {
  console.log('Enter the domain name:');

  const domainName = await $`read domainName && echo $domainName`;
  console.log(`Creating domain ${domainName}`);
  // Create the domain
  await createDomain(domainName);
};

// Run the main function
main();
