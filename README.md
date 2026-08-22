# clash-rules

Mihomo (Clash Meta) 规则集仓库，由 GitHub Actions 每日 06:30 自动生成并发布到 [`meta`](https://github.com/haha12358/clash-rules/tree/meta) 分支，可通过 `rule-providers` 直接订阅使用。

![Build](https://github.com/haha12358/clash-rules/actions/workflows/run.yml/badge.svg)

## 使用方式

在 Clash 配置中添加如下 `rule-providers` 和 `rules` 即可。

### Rule Providers

```yaml
rule-anchor:
  ip: &ip {type: http, interval: 86400, behavior: ipcidr, format: mrs}
  domain: &domain {type: http, interval: 86400, behavior: domain, format: mrs}
  class: &class {type: http, interval: 86400, behavior: classical, format: yaml}

rule-providers:
  fakeip-filter: {<<: *domain, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/other/fakeip-filter.mrs"}
  private: {<<: *domain, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geosite/private.mrs"}
  ai: {<<: *domain, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geosite/category-ai-!cn.mrs"}
  geolocation-!cn: {<<: *domain, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geosite/geolocation-!cn.mrs"}
  cn: {<<: *domain, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geosite/cn.mrs"}

  telegramcidr: {<<: *ip, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geoip/telegram.mrs"}
  cncidr: {<<: *ip, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geoip/cn.mrs"}
  lancidr: {<<: *ip, url: "https://raw.githubusercontent.com/haha12358/clash-rules/meta/geoip/private.mrs"}
```

### Rules

```yaml
# 需要确保有 name 为 AI 和 PROXY 的 proxies 或 proxy-groups
rules:
  - RULE-SET,private,DIRECT
  - RULE-SET,ai,AI
  - RULE-SET,geolocation-!cn,PROXY
  - RULE-SET,cn,DIRECT
  - RULE-SET,lancidr,DIRECT,no-resolve
  - RULE-SET,telegramcidr,PROXY,no-resolve
  - RULE-SET,cncidr,DIRECT
  - MATCH,PROXY
```

### 说明

- `fakeip-filter` 用于 `dns` 的 `fake-ip-filter`：

  ```yaml
  dns:
    fake-ip-filter:
    - "rule-set:fakeip-filter"
  ```

- [config.yaml](https://github.com/haha12358/clash-rules/blob/hidden/config.yaml) 为完整参考配置，可自行修改。
- 其余规则集（`category-ads-all`、`icloud`、`apple`、`google` 等）见 [`meta` 分支](https://github.com/haha12358/clash-rules/tree/meta)：`geosite/`、`geoip/`、`asn/` 为规则集目录，`other/` 内含 `applications` 与 `fakeip-filter`。
