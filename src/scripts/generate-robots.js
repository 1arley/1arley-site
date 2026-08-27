const path = require("path");
const fs = require("fs");

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
const sitemapUrl = `${baseUrl}/sitemap.xml`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

const outputPath = path.resolve("public", "robots.txt");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, robotsTxt, "utf8");

console.log(`Robots.txt gerado em: ${outputPath}`);
