import { NextRequest } from "next/server";

export async function GET() {
  const apiKey = process.env.MY_KEY;
  const url = "https://mario-extended.vercel.app/api/echo"; // Replace with your actual Website A URL

  try {
    const apiRes = await fetch(url, {
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    // Handle non-JSON responses
    const contentType = apiRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await apiRes.text();
      console.error("API error response:", text);
      return new Response(text, { status: apiRes.status });
    }

    const response = await apiRes.json();

    // Transform response -> GameItem[]
    const gameItems = (response.items || []).map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      category: item.category,
      type: item.type,
      power: item.power,
      effect: item.effect,
      rarity: item.rarity,
      description: item.description,
      imageUrl: item.imageUrl,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      fileName: item.fileName,
      // Add source tracking
      isUserCreated: false,
      uploaderId: null,
      source: 'api',
    }));

    return Response.json(gameItems, { status: apiRes.status });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return Response.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.MY_KEY;
  const { keyword } = await request.json();
  const url = "https://mario-extended.vercel.app/api/echo"; // Replace with your actual Website A URL

  try {
    const apiRes = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postBody: keyword,
      }),
    });

    // Handle non-JSON responses
    const contentType = apiRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await apiRes.text();
      console.error("API error response:", text);
      return new Response(text, { status: apiRes.status });
    }

    const response = await apiRes.json();

    // Transform items
    const gameItems = (response.items || []).map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      category: item.category,
      type: item.type,
      power: item.power,
      effect: item.effect,
      rarity: item.rarity,
      description: item.description,
      imageUrl: item.imageUrl,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      fileName: item.fileName,
      // Add source tracking
      isUserCreated: false,
      uploaderId: null,
      source: 'api',
    }));

    return Response.json(gameItems, { status: apiRes.status });
  } catch (error) {
    console.error("Failed to search items:", error);
    return Response.json({ error: "Failed to search items" }, { status: 500 });
  }
}