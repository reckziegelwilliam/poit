# Poetry Screenshot Gallery

A beautiful, private poetry gallery that lets you share screenshots from your iOS Notes app directly to your personal website. Only you can upload (restricted by phone number), but anyone can view your collection.

## Features

- 📱 **iOS Share Sheet Integration** - Share directly from Photos/Notes app
- 🔒 **Phone Number Restricted** - Only your phone (+12074237861) can upload
- 🖼️ **Beautiful Gallery** - Responsive grid layout with lightbox viewer
- 🌙 **Dark Mode Support** - Automatic theme switching
- ⚡ **Real-time Updates** - Gallery refreshes automatically
- 📅 **Chronological Display** - Newest poems appear first

## Setup Instructions

### 1. Deploy to Vercel

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Deploy (it will build automatically)

### 2. Enable Vercel Blob Storage

1. In your Vercel dashboard, go to your project
2. Navigate to the "Storage" tab
3. Create a new Blob store
4. Vercel will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable

### 3. Add Security Environment Variables

In Vercel → Settings → Environment Variables, add:

- `ALLOWED_PHONE` = `+12074237861`
- `UPLOAD_TOKEN` = Generate a secure random string (e.g., use [uuidgenerator.net](https://www.uuidgenerator.net/))
- `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app` (optional, Vercel provides this)

### 4. Create iOS Shortcut

1. Open the **Shortcuts** app on your iPhone
2. Tap **+** to create a new shortcut
3. Name it "Share Poetry"
4. Tap the **ⓘ** button and:
   - Enable **"Show in Share Sheet"**
   - Set **Accepted Types**: Images

5. Add these actions in order:

   a. **Convert Image**
   - Format: JPEG
   - Preserve Metadata: Off
   - Quality: High

   b. **Get Contents of URL**
   - URL: `https://your-project.vercel.app/api/upload`
   - Method: **POST**
   - Headers:
     - `X-Phone`: `+12074237861`
     - `X-Upload-Token`: Your UPLOAD_TOKEN value
     - `X-TS`: Insert Variable → Current Date → Format as Unix Timestamp
   - Request Body: **Form**
     - Add field `file`: Shortcut Input (the converted image)
     - Optional field `title`: Text (or Ask Each Time)

   c. **Get Dictionary from Input**

   d. **Get Dictionary Value**
   - Get: Value for `url` in (Dictionary from previous action)

   e. **Copy to Clipboard** (or **Open URLs** to view immediately)

6. Save the shortcut

## Usage

1. Take a screenshot of your poetry in the Notes app
2. Open Photos and find the screenshot
3. Tap the Share button
4. Select "Share Poetry" from the share sheet
5. The image uploads and the URL is copied to your clipboard
6. Visit your website to see it in the gallery!

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local file with your environment variables
# Copy from ENVIRONMENT_VARIABLES.txt

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Security Features

- **Phone Number Verification**: Only requests from your phone number are accepted
- **Upload Token**: Secret token prevents unauthorized uploads
- **Timestamp Validation**: Requests expire after 5 minutes to prevent replay attacks
- **Public Gallery**: While uploads are restricted, the gallery is publicly viewable

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Vercel Blob** - Object storage for images
- **Tailwind CSS** - Styling and responsive design
- **TypeScript** - Type safety
- **iOS Shortcuts** - Native iOS integration

## Troubleshooting

### Shortcut doesn't appear in Share Sheet
- Make sure you enabled "Show in Share Sheet" in shortcut settings
- Set "Accepted Types" to Images
- Try restarting your phone

### Upload fails with "Unauthorized"
- Verify your phone number matches exactly (including country code)
- Check that the upload token in Shortcut matches Vercel environment variable
- Ensure the X-TS timestamp is being sent

### Images don't appear in gallery
- Check Vercel Blob storage dashboard for uploaded files
- Verify the `/api/list` endpoint is working
- Check browser console for errors

## Future Enhancements

- [ ] Add image captions/titles
- [ ] Search functionality
- [ ] Categories or tags
- [ ] Export/backup feature
- [ ] PWA support for offline viewing