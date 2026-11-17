// Submits every URL in a site's sitemap to IndexNow (Bing, Yandex, Seznam, Naver).
// Usage: node scripts/indexnow.mjs help.recordful.app (same script as in recordful-ee)
// Each host must serve /<KEY>.txt (it lives in that site's public/ folder).
const KEY = "757c3429f063a7c8bb5633fb92a62b6c";

for (const host of process.argv.slice(2)) {
  const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) throw new Error(`${host}: no URLs in sitemap.xml`);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList }),
  });
  console.log(`${host}: ${urlList.length} URLs -> ${res.status} ${await res.text()}`);
  if (!res.ok) process.exitCode = 1;
}
