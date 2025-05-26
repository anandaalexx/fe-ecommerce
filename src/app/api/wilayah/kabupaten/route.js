export async function GET(req) {
  const url = new URL(req.url); // Membaca URL untuk mengambil query parameter
  const kodeProvinsi = url.searchParams.get('kode_provinsi'); // Mengambil kode_provinsi dari query parameter

  if (!kodeProvinsi) {
    return new Response(
      JSON.stringify({ error: "Kode provinsi tidak ditemukan" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Mengambil data kabupaten berdasarkan kode_provinsi dari URL
    const response = await fetch(`http://127.0.0.1:8000/kabupaten?kode_provinsi=${kodeProvinsi}`);
    const data = await response.json();

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch kabupaten" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}