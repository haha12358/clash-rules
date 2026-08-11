### 使用方式

要想使用本项目的规则集，只需要在 Clash 配置文件中添加如下 `rule-providers` 和 `rules`。

#### Rule Providers 配置方式

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

#### Rules 配置方式

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

#### 规则集说明

- [config.yaml](https://github.com/haha12358/clash-rules/blob/hidden/config.yaml) 为参考配置，可自行修改

- `fakeip-filter` 规则集使用在 `dns` 中:
    ```yaml
    fake-ip-filter:
    - "rule-set:fakeip-filter"
    ```
 
- 其余 `category-ads-all`, `icloud`, `apple`, `google` 等规则集可以在 [meta分支](https://github.com/haha12358/clash-rules/tree/meta) 下的 [geosite](https://github.com/haha12358/clash-rules/tree/meta/geosite) 内找到。

- `applications` 已存放到 [meta分支](https://github.com/haha12358/clash-rules/tree/meta) 下的 [other](https://github.com/haha12358/clash-rules/tree/meta/other) 内。
