export async function GET(req) {
  const url = new URL(req.url); // Membaca URL untuk mengambil query parameter
  const kodeKabupaten = url.searchParams.get('kode_kabupaten'); // Mengambil kode_kabupaten dari query parameter

  if (!kodeKabupaten) {
    return new Response(
      JSON.stringify({ error: "Kode kabupaten tidak ditemukan" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/kecamatan?kode_kabupaten=${kodeKabupaten}`);
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
      JSON.stringify({ error: "Failed to fetch kecamatan" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}