export async function GET() {
  const apiKey = process.env.MY_KEY;
  const url = "https://mario-extended.vercel.app/api/echo";

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
  const gameItems = (response.data || []).map((item: any) => ({
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
  }));

  return Response.json(gameItems, { status: apiRes.status });
}

export async function POST(request: Request) {
  const apiKey = process.env.MY_KEY;
  const { keyword } = await request.json();

  const url = "https://mario-extended.vercel.app/api/echo";

  const apiRes = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postBody: keyword,
      action: "search_game_items",
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

  // Transform single item (if found)
  const gameItems =
    response.ok && response.item
      ? [
          {
            id: Number(response.item.id),
            name: response.item.name,
            category: response.item.category,
            type: response.item.type,
            power: response.item.power,
            effect: response.item.effect,
            rarity: response.item.rarity,
            description: response.item.description,
            imageUrl: response.item.imageUrl,
            userId: response.item.userId,
            createdAt: response.item.createdAt,
            updatedAt: response.item.updatedAt,
            fileName: response.item.fileName,
          },
        ]
      : [];

  return Response.json(gameItems, { status: apiRes.status });
}
