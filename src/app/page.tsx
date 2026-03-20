import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

function getPlants() {
  const dir = path.join(process.cwd(), "content/plants");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(raw);
      const serialized = Object.fromEntries(
  Object.entries(data).map(([k, v]) => [
    k,
    v instanceof Date ? v.toISOString().split("T")[0] : v,
  ])
);
  return { slug: filename.replace(".md", ""), ...serialized } as any;
    });
}

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  育成中:  { bg: "#e8f0e0", text: "#3a5a2a", border: "#7a9a6a" },
  要観察: { bg: "#f5ecd5", text: "#7a5a1a", border: "#c49a3a" },
  休眠中: { bg: "#e5edf0", text: "#2a4a5a", border: "#5a8a9a" },
  譲渡済み: { bg: "#ede9e5", text: "#5a4a3a", border: "#9a8a7a" },
};

export default function Home() {
  const plants = getPlants();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+JP:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: #f2ede4;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          min-height: 100vh;
          font-family: 'Noto Serif JP', serif;
        }

        .page-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* ── HEADER ── */
        .site-header {
          padding: 56px 0 40px;
          border-bottom: 1px solid #c8b89a;
          margin-bottom: 48px;
          position: relative;
        }
        .site-header::before {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 60px; height: 3px;
          background: #4a7a3a;
        }
        .header-eyebrow {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 13px;
          color: #7a6a4a;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }
        .site-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 600;
          color: #2a3a1a;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .site-title span {
          color: #4a7a3a;
        }
        .site-subtitle {
          font-size: 13px;
          color: #8a7a5a;
          letter-spacing: 0.08em;
        }
        .plant-count {
          display: inline-block;
          background: #4a7a3a;
          color: #f2ede4;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 2px;
          margin-left: 10px;
          letter-spacing: 0.05em;
          vertical-align: middle;
        }

        /* ── GRID ── */
        .plant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        /* ── CARD ── */
        .plant-card {
          background: #faf6ef;
          border: 1px solid #d4c4a8;
          border-radius: 4px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          box-shadow: 2px 2px 8px rgba(100,80,40,0.08);
        }
        .plant-card:hover {
          transform: translateY(-4px);
          box-shadow: 4px 8px 20px rgba(100,80,40,0.15);
        }
        .plant-card::after {
          content: '';
          position: absolute;
          top: 6px; left: 6px; right: -6px; bottom: -6px;
          border: 1px solid #d4c4a8;
          border-radius: 4px;
          z-index: -1;
          opacity: 0.5;
        }

        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid #d4c4a8;
          filter: sepia(10%) contrast(95%);
        }
        .card-image-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #e8e0d0 0%, #d8cdb8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #d4c4a8;
          font-size: 48px;
          color: #a89878;
        }

        .card-body {
          padding: 18px 20px 20px;
        }

        .card-status {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          padding: 2px 9px;
          border-radius: 2px;
          letter-spacing: 0.08em;
          border: 1px solid;
          margin-bottom: 10px;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: #2a3a1a;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .card-species {
          font-style: italic;
          font-size: 12px;
          color: #8a7a5a;
          margin-bottom: 14px;
        }

        .card-meta {
          display: flex;
          gap: 14px;
          font-size: 11px;
          color: #9a8a6a;
          border-top: 1px dashed #d4c4a8;
          padding-top: 12px;
        }
        .card-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── EMPTY ── */
        .empty-state {
          text-align: center;
          padding: 80px 0;
          color: #9a8a6a;
        }
        .empty-state p {
          font-size: 15px;
          margin-top: 12px;
        }
      `}</style>

      <div className="page-wrapper">
        <header className="site-header">
          <p className="header-eyebrow">Cultivation Journal</p>
          <h1 className="site-title">
            <span>Platycerium</span> 育成記録
          </h1>
          <p className="site-subtitle">
            我が家のビカクシダたち
            <span className="plant-count">{plants.length} 株</span>
          </p>
        </header>

        {plants.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🌿</div>
            <p>まだ株が登録されていません</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>/admin/ から最初の株を追加してください</p>
          </div>
        ) : (
          <div className="plant-grid">
            {plants.map((plant: any) => {
              const statusStyle = STATUS_COLOR[plant.status] ?? STATUS_COLOR["育成中"];
              const diaryCount = (plant.diary || []).length;
              return (
                <Link key={plant.slug} href={`/plants/${plant.slug}`} className="plant-card">
                  {plant.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={plant.cover_image}
                      alt={plant.title}
                      className="card-image"
                    />
                  ) : (
                    <div className="card-image-placeholder">🌿</div>
                  )}
                  <div className="card-body">
                    <span
                      className="card-status"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        borderColor: statusStyle.border,
                      }}
                    >
                      {plant.status ?? "育成中"}
                    </span>
                    <h2 className="card-title">{plant.title}</h2>
                    <p className="card-species">{plant.species || "—"}</p>
                    <div className="card-meta">
                      {plant.acquired_date && (
                        <span className="card-meta-item">📅 {plant.acquired_date}</span>
                      )}
                      {plant.location && (
                        <span className="card-meta-item">📍 {plant.location}</span>
                      )}
                      {diaryCount > 0 && (
                        <span className="card-meta-item" style={{ marginLeft: "auto" }}>
                          📔 {diaryCount}件
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
