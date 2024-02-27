export default async function POST(req, res) {
  if (req.method === 'POST') {
    // Process POST request
    // You'll need to extract the file from `req` and then call `uploadFileToWordPress(file)`
    // Respond to the client with success or error
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}