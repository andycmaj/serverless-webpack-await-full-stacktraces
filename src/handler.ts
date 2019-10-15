async function functionOne() {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1);
  });
  throw new Error('Something Bad');
}

async function functionTwo() {
  await functionOne();
}

export const hello = async (event, context, cb) => {
  try {
    await functionTwo();
  } catch (error) {
    console.error(error);
  }

  cb(null, {
    message:
      'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    event,
  });
};
