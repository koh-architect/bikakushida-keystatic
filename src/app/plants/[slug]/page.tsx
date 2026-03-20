import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/plants");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(".md", "") }));
}

// 日付オブジェクトを再帰的に文字列に変換する関数
const serializeData = (obj: any): any => {
  if (obj instanceof Date) return obj.toISOString().split("T")[0];
  if (Array.isArray(obj)) return obj.map(serializeData);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeData(v)])
    );
  }
  return obj;
};

export default async function PlantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const file = path.join(process.cwd(), "content/plants", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data: rawData } = matter(raw);

  // 日付をすべて文字列に変換してから使う
  const data = serializeData(rawData);

  const diary = (data.diary || []).sort((a: any, b: any) =>
    b.date.localeCompare(a.date)
  );

  const TYPE_ICON: Record<string, string> = {
    水やり: "💧",
    施肥: "🌱",
    植え替え: "🪴",
    観察: "🔍",
    その他: "📝",
  };

  const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
    育成中:  { bg: "#e8f0e0", text: "#3a5a2a", border: "#7a9a6a" },
    要観察: { bg: "#f5ecd5", text: "#7a5a1a", border: "#c49a3a" },
    休眠中: { bg: "#e5edf0", text: "#2a4a5a", border: "#5a8a9a" },
    譲渡済み: { bg: "#ede9e5", text: "#5a4a3a", border: "#9a8a7a" },
  };
  const statusStyle = STATUS_COLOR[data.status] ?? STATUS_COLOR["育成中"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+JP:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: #f2ede4;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          min-height: 100vh;
          font-family: 'Noto Serif JP', serif;
          color: #2a2a1a;
        }

        .page-wrapper {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 40px 0 32px;
          font-size: 13px;
          color: #4a7a3a;
          text-decoration: none;
          letter-spacing: 0.05em;
        }
        .back-link:hover { text-decoration: underline; }

        .hero-image-wrap {
          position: relative;
          margin-bottom: 32px;
        }
        .hero-image {
          width: 100%;
          max-height: 420px;
          object-fit: cover;
          display: block;
          border: 1px solid #c8b89a;
          filter: sepia(8%) contrast(96%);
        }
        .hero-placeholder {
          width: 100%;
          height: 280px;
          background: linear-gradient(135deg, #e8e0d0, #d4c8b0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 72px;
          border: 1px solid #c8b89a;
          color: #a89878;
        }
        .hero-image-wrap::before,
        .hero-image-wrap::after {
          content: '';
          position: absolute;
          width: 20px; height: 20px;
          border-color: #8a7a4a;
          border-style: solid;
          z-index: 1;
        }
        .hero-image-wrap::before {
          top: -6px; left: -6px;
          border-width: 2px 0 0 2px;
        }
        .hero-image-wrap::after {
          bottom: -6px; right: -6px;
          border-width: 0 2px 2px 0;
        }

        .title-block {
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid #c8b89a;
          position: relative;
        }
        .title-block::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 40px; height: 2px;
          background: #4a7a3a;
        }
        .status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 2px;
          letter-spacing: 0.08em;
          border: 1px solid;
          margin-bottom: 14px;
        }
        .plant-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 5vw, 36px);
          font-weight: 600;
          color: #1a2a0a;
          line-height: 1.25;
          margin-bottom: 6px;
        }
        .plant-species {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 15px;
          color: #7a6a4a;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #c8b89a;
          border: 1px solid #c8b89a;
          margin-bottom: 28px;
        }
        .info-cell {
          background: #faf6ef;
          padding: 14px 18px;
        }
        .info-label {
          font-size: 10px;
          color: #9a8a6a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          color: #2a2a1a;
          font-weight: 500;
        }

        .description {
          font-size: 14px;
          line-height: 2;
          color: #4a4a3a;
          margin-bottom: 48px;
          padding: 20px 24px;
          background: #faf6ef;
          border-left: 3px solid #4a7a3a;
          border-top: 1px solid #d4c4a8;
          border-bottom: 1px solid #d4c4a8;
          border-right: 1px solid #d4c4a8;
        }

        .diary-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #2a3a1a;
          margin-bottom: 24px;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .diary-count {
          font-family: 'Noto Serif JP', serif;
          font-size: 13px;
          color: #9a8a6a;
          font-weight: 300;
        }

        .diary-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .diary-list::before {
          content: '';
          position: absolute;
          left: 16px;
          top: 0; bottom: 0;
          width: 1px;
          background: #c8b89a;
        }

        .diary-entry {
          display: flex;
          gap: 24px;
          padding-bottom: 32px;
          position: relative;
        }
        .diary-dot {
          width: 33px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          padding-top: 4px;
        }
        .diary-dot-inner {
          width: 14px;
          height: 14px;
          background: #faf6ef;
          border: 2px solid #4a7a3a;
          border-radius: 50%;
          position: relative;
          z-index: 1;
        }

        .diary-card {
          flex: 1;
          background: #faf6ef;
          border: 1px solid #d4c4a8;
          padding: 18px 20px;
          box-shadow: 1px 1px 4px rgba(100,80,40,0.06);
        }
        .diary-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .diary-type-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          background: #e8f0e0;
          color: #3a5a2a;
          border: 1px solid #7a9a6a;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }
        .diary-date {
          font-size: 12px;
          color: #9a8a6a;
          letter-spacing: 0.05em;
        }
        .diary-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          display: block;
          margin-bottom: 12px;
          border: 1px solid #d4c4a8;
          filter: sepia(5%) contrast(97%);
        }
        .diary-note {
          font-size: 14px;
          line-height: 1.9;
          color: #4a4a3a;
        }

        .diary-empty {
          text-align: center;
          padding: 40px;
          color: #9a8a6a;
          font-size: 14px;
          background: #faf6ef;
          border: 1px dashed #c8b89a;
        }
      `}</style>

      <div className="page-wrapper">
        <a href="/" className="back-link">← 標本一覧へ戻る</a>

        <div className="hero-image-wrap">
          {data.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.cover_image} alt={data.title} className="hero-image" />
          ) : (
            <div className="hero-placeholder">🌿</div>
          )}
        </div>

        <div className="title-block">
          <span
            className="status-badge"
            style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              borderColor: statusStyle.border,
            }}
          >
            {data.status ?? "育成中"}
          </span>
          <h1 className="plant-title">{data.title}</h1>
          {data.species && <p className="plant-species">{data.species}</p>}
        </div>

        <div className="info-grid">
          <div className="info-cell">
            <div className="info-label">入手日</div>
            <div className="info-value">{data.acquired_date || "—"}</div>
          </div>
          <div className="info-cell">
            <div className="info-label">置き場所</div>
            <div className="info-value">{data.location || "—"}</div>
          </div>
          <div className="info-cell">
            <div className="info-label">板付け素材</div>
            <div className="info-value">{data.mount || "—"}</div>
          </div>
          <div className="info-cell">
            <div className="info-label">記録数</div>
            <div className="info-value">{diary.length} 件</div>
          </div>
        </div>

        {data.description && (
          <p className="description">{data.description}</p>
        )}

        <h2 className="diary-section-title">
          成長日誌
          <span className="diary-count">{diary.length} 件の記録</span>
        </h2>

        {diary.length === 0 ? (
          <div className="diary-empty">
            📔 まだ日誌の記録がありません。/admin/ から追加してください。
          </div>
        ) : (
          <div className="diary-list">
            {diary.map((entry: any, i: number) => (
              <div key={i} className="diary-entry">
                <div className="diary-dot">
                  <div className="diary-dot-inner" />
                </div>
                <div className="diary-card">
                  <div className="diary-card-header">
                    <span className="diary-type-badge">
                      {TYPE_ICON[entry.type] ?? "📝"} {entry.type}
                    </span>
                    <span className="diary-date">{entry.date}</span>
                  </div>
                  {entry.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.image}
                      alt={`${entry.date}の記録`}
                      className="diary-image"
                    />
                  )}
                  <p className="diary-note">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
