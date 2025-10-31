export async function generateSummaryService(videoId: any) {
  const url = "/api/summary";
  try {
    const Response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ videoId: videoId }),
    });
    return await Response.json();
  } catch (error) {
    console.error("failed to generate summary:", error);
    if (error instanceof Error) return { error: { message: error.message } };
    return { data: null, error: { message: "Unknown error" } };
  }
}

// export async function generateSummaryService(videoId: string) {
//   const url = "/api/summary";
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ videoId }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("404 or error:", errorText);
//       return { data: null, error: { message: `API error: ${response.status}` } };
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("failed to generate summary:", error);
//     return { data: null, error: { message: error instanceof Error ? error.message : "Unknown error" } };
//   }
// }

