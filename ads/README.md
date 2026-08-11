# AdBlock Rules for Clash Meta(Mihomo)

将 [jiekouAD](https://github.com/damengzhu/banad) 广告过滤规则合并、去重，生成适用于 Clash Meta(Mihomo) 的规则集（yaml + mrs）。

规则源文件存放在 `rules/` 目录，由 `run.yml` 工作流调用 `filter.py` 转换生成 `jiekouAD.yaml`。每次构建时工作流会先自动拉取上游最新版 `jiekouAD.txt` 覆盖本地文件，仓库内副本作为下载失败时的兜底。

## 上游规则源

| 规则 | 类型 | 原始链接 | 更新日期 |
|:-|:-|:-|:-|
| jiekouAD | filter | [原始链接](https://raw.githubusercontent.com/damengzhu/banad/main/jiekouAD.txt) | 2026/08/06 |

## 说明

1. 源文件无需手动更新：`run.yml` 每次构建自动从 [damengzhu/banad](https://github.com/damengzhu/banad) 拉取最新版。
2. 转换代码裁剪自 [217heidai/adblockfilters](https://github.com/217heidai/adblockfilters)，仅保留 Clash Meta(Mihomo) 输出格式。
