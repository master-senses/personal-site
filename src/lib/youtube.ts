function buildEmbedUrl(videoId: string): string {
  const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
  embed.searchParams.set("vq", "hd1080");
  return embed.toString();
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      return id ? buildEmbedUrl(id) : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? buildEmbedUrl(id) : null;
    }
  } catch {
    return null;
  }

  return null;
}
