export default async function handler(req, res) {
  // শুধুমাত্র POST রিকোয়েস্ট অ্যালাও করবে
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ফ্রন্ট-এন্ড থেকে পাঠানো Base64 ফরম্যাটের ছবি গ্রহণ করবে
    const { imageBase64 } = req.body;
    
    // Vercel Settings থেকে লুকানো API Key টি নেবে
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel settings' });
    }

    // ImgBB-এর জন্য ডেটা প্রস্তুত করা
    const formData = new URLSearchParams();
    // ছবির Base64 ডেটা থেকে শুধু আসল কনটেন্টটুকু আলাদা করে পাঠানো
    formData.append('image', imageBase64.replace(/^data:image\/[a-z]+;base64,/, ""));

    // ImgBB সার্ভারে ছবি আপলোড
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    
    // ফ্রন্ট-এন্ডে সফলভাবে আপলোড হওয়া ছবির লিংক ফেরত পাঠানো
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
