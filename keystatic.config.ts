import { config, collection, fields } from "@keystatic/core";

export default config({
  sstorage: {
  kind: "github",
  repo: "koh-architect/bikakushida-keystatic",
  branchPrefix: "main",
},

  collections: {
    plants: collection({
      label: "株の管理",
      slugField: "title",
      path: "content/plants/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "株名" } }),
        species: fields.text({ label: "品種", validation: { isRequired: false } }),
        acquired_date: fields.date({ label: "入手日" }),
        location: fields.text({ label: "置き場所", validation: { isRequired: false } }),
        mount: fields.text({ label: "板付け素材", validation: { isRequired: false } }),
        status: fields.select({
          label: "ステータス",
          options: [
            { label: "育成中", value: "育成中" },
            { label: "要観察", value: "要観察" },
            { label: "休眠中", value: "休眠中" },
            { label: "譲渡済み", value: "譲渡済み" },
          ],
          defaultValue: "育成中",
        }),
        cover_image: fields.image({
          label: "アイキャッチ画像",
          directory: "public/images/uploads",
          publicPath: "/images/uploads",
        }),
        description: fields.text({
          label: "メモ・特徴",
          multiline: true,
          validation: { isRequired: false },
        }),
        diary: fields.array(
          fields.object({
            date: fields.date({ label: "日付" }),
            type: fields.select({
              label: "種類",
              options: [
                { label: "水やり", value: "水やり" },
                { label: "施肥", value: "施肥" },
                { label: "植え替え", value: "植え替え" },
                { label: "観察", value: "観察" },
                { label: "その他", value: "その他" },
              ],
              defaultValue: "観察",
            }),
            image: fields.image({
              label: "写真",
              directory: "public/images/uploads",
              publicPath: "/images/uploads",
            }),
            note: fields.text({ label: "記録メモ", multiline: true }),
          }),
          {
            label: "成長日誌",
            itemLabel: (props) =>
              `${props.fields.date.value || "日付未設定"} — ${props.fields.type.value || "種類未設定"}`,
          }
        ),
      },
    }),
  },
});