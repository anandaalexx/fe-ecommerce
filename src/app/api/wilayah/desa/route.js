export async function GET(req) {
  const url = new URL(req.url); // Membaca URL untuk mengambil query parameter
  const kodeKecamatan = url.searchParams.get("kode_kecamatan"); // Mengambil kode_kecamatan dari query parameter

  if (!kodeKecamatan) {
    return new Response(
      JSON.stringify({ error: "Kode kecamatan tidak ditemukan" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/desa?kode_kecamatan=${kodeKecamatan}`
    );
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch desa" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
