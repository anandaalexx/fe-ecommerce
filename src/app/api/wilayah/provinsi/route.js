export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:8000/provinsi");
    const data = await response.json();

    return Response.json(data); // ✔ ini penting!
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch provinces" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
