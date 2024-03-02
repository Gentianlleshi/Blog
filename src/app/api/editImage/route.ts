import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false, // We're using formidable for parsing form data
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      try {
        // You may get either one file or an array of files depending on the upload
        let file = Array.isArray(files.file) ? files.file[0] : files.file;

        // Ensure that file is defined before proceeding
        if (!file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        // If file is an array, we take the first one (assuming single file upload)
        // Now file is of type formidable.File | undefined
        if (Array.isArray(file)) {
          // If it's an array, let's take the first file
          file = file[0];
        }

        // Check if file is actually a file and has a filepath
        if (file && file.filepath) {
          // Perform image editing with sharp
          const editedImage = await sharp(file.filepath)
            .resize({ width: 200, height: 200 })
            .toBuffer();

          // Cleanup the uploaded file
          fs.unlinkSync(file.filepath);

          // Send the edited image back as a response
          res.setHeader('Content-Type', 'image/png');
          res.send(editedImage);
        } else {
          res.status(400).json({ error: 'Invalid file upload' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error processing image' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
