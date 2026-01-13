import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.METEOSOURCE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing API key" },
      { status: 500 }
    );
  }

  const endpoint = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=current,hourly,daily&units=metric&key=${apiKey}`;

  try {
    const res = await fetch(endpoint);

    // Check if API returned JSON error
    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok || data?.detail || data?.error) {
      return NextResponse.json(
        { error: "Meteosource error", detail: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Fetch failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
