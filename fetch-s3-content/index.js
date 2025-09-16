exports.handler = async (event) => {
  try {
    const url = event.queryStringParameters?.url;

    // start timer
    const start = Date.now();

    const response = await fetch(url);
    const body = await response.text();

    console.log("Status:", response.status);
    console.log("Body length:", body.length);

    // end timer
    const latency = Date.now() - start;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Fetched website successfully",
        status: response.status,
        contentSnippet: body.substring(0, 200), // only first 200 chars
        fetchTimeMs: latency
      })
    };
  } catch (err) {
    console.error("Error fetching S3 site:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

