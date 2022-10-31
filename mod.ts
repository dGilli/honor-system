import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';

const hostName = new TextDecoder().decode(await Deno.run({
  cmd: ["uname", "-n"],
  stdout: 'piped'
}).output())
.replace(/.home/i, '.local')
.trim()

const qrData = `http://${hostName}:8000`

const qp = new URLSearchParams({
  cht: "qr", // Chart type
  chs: "300x300", // QR code dimensions
  chl: qrData, // Data embedded in QR code
});
const res = await fetch("https://chart.googleapis.com/chart?" + qp);
if (res.status === 200 && res.body) {
  const qrFile = await Deno.open("./qrCode.png", { create: true, write: true });
  res.body.pipeTo(qrFile.writable);
  console.log(`Created QR code for ${qrData}`)
}

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // This is how the server works:
  // 1. A request comes in for a specific asset.
  // 2. We read the asset from the file system.
  // 3. We send the asset back to the client.

  // Check if the request is for app.js.
  if (pathname.startsWith('/app.js')) {
    // Read the app.js file from the file system.
    const file = await Deno.readFile('./app.js');
    // Respond to the request with the app.js file.
    return new Response(file, {
      headers: {
        'content-type': 'application/javascript',
      },
    });
  }

  if (pathname.startsWith('/qr')) {
    // Read the app.js file from the file system.
    const file = await Deno.readFile('./qrCode.png');
    // Respond to the request with the app.js file.
    return new Response(file, {
      headers: {
        'content-type': 'image/png',
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <script src="app.js"></script>
      </head>
      <body>
        <h1>Example</h1>
      </body>
    </html>`,
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    },
  );
}

serve(handleRequest);
