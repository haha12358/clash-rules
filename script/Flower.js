/**
 * Flower.yaml 的 mihomo 配置覆写脚本。
 * 自用脚本，如需使用通用脚本请查看https://github.com/AIsouler/MyClash
 */

const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const ruleOptionsEnable = {
  手动选择: true, // 是否生成“🇺🇳 全部”手动选择组
  自动选择: true, // 是否生成“♻️ 自动选择”组
  AI: true, // AI 分流
  娱乐: true, // 娱乐分流
  Google: true, // Google 分流
  AdBlock: true, // 广告拦截
  生成地区自动选择组: true, // 是否生成各地区自动选择组
  隐藏地区手动选择组: false, // 是否隐藏地区手动选择组
  生成低倍率组: true, // 是否生成“😊 低倍率”组
  分流组添加所有节点: false, // 娱乐组是否加入全部节点（AI 组已包含）
};

const chinaDNS = [
  'https://dns.alidns.com/dns-query#DIRECT',
  'https://doh.pub/dns-query#DIRECT',
];
const foreignDNS = [
  'https://dns.google/dns-query#😊 低倍率',
  'https://cloudflare-dns.com/dns-query#😊 低倍率',
];
function getForeignDNS() {
  if (ruleOptionsEnable.生成低倍率组) return foreignDNS;
  return foreignDNS.map((dns) => dns.replace('#😊 低倍率', '#🚀 默认'));
}

const defaultDNS = [
  'https://223.5.5.5/dns-query#DIRECT',
  'https://1.12.12.12/dns-query#DIRECT',
];

const groupBaseOption = {
  interval: 600,
  timeout: 3000,
  'max-failed-times': 3,
  'empty-fallback': 'REJECT',
  url: 'https://www.gstatic.com/generate_204',
  lazy: true,
};
const selectOption = { ...groupBaseOption, type: 'select' };
const urlTestOption = {
  ...groupBaseOption,
  type: 'url-test',
  tolerance: 50,
  'include-all': true,
  'exclude-type': 'DIRECT',
  hidden: true,
};

const regionFilters = [
  { name: '🇭🇰 香港', autoName: '♻️ 香港自动', filter: '🇭🇰|香港' },
  { name: '🇸🇬 新加坡', autoName: '♻️ 新加坡自动', filter: '🇸🇬|新加坡' },
  { name: '🇯🇵 日本', autoName: '♻️ 日本自动', filter: '🇯🇵|日本' },
  { name: '🇨🇳 台湾', autoName: '♻️ 台湾自动', filter: '🇨🇳|台湾' },
  { name: '🇺🇸 美国', autoName: '♻️ 美国自动', filter: '🇺🇸|美国' },
];

const ruleProviderBaseUrl = 'https://raw.githubusercontent.com/haha12358/clash-rules/';
const domainProviderOption = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain' };
const ipProviderOption = { type: 'http', format: 'mrs', interval: 86400, behavior: 'ipcidr' };

function createRuleProvider(option, path) {
  return { ...option, url: `${ruleProviderBaseUrl}${path}` };
}

function createProxyGroups() {
  const generateRegionAutoSelect = ruleOptionsEnable.生成地区自动选择组;
  const generateLowRateGroup = ruleOptionsEnable.生成低倍率组;
  const fallbackProxies = [...(generateLowRateGroup ? ['😊 低倍率'] : []), '🚀 默认'];

  const regionGroups = regionFilters.map(({ name, autoName, filter }) => ({
    ...selectOption,
    name,
    'include-all': true,
    ...(generateRegionAutoSelect && { proxies: [autoName] }),
    filter,
    ...(ruleOptionsEnable.隐藏地区手动选择组 && { hidden: true }),
  }));
  const regionAutoGroups = generateRegionAutoSelect
    ? regionFilters.map(({ autoName, filter }) => ({
        ...urlTestOption,
        name: autoName,
        filter,
      }))
    : [];

  const defaultProxies = [
    '🇯🇵 日本',
    '🇭🇰 香港',
    '🇸🇬 新加坡',
    '🇨🇳 台湾',
    '🇺🇸 美国',
    ...(ruleOptionsEnable.手动选择 ? ['🇺🇳 全部'] : []),
    ...(!ruleOptionsEnable.手动选择 && ruleOptionsEnable.自动选择 ? ['♻️ 自动选择'] : []),
  ];

  return [
    { ...selectOption, name: '🚀 默认', proxies: defaultProxies },
    ...(ruleOptionsEnable.AI
      ? [{ ...selectOption, name: '🤖 AI', 'include-all': true, proxies: ['🚀 默认'], filter: '高级' }]
      : []),
    ...(ruleOptionsEnable.娱乐
      ? [{
          ...selectOption,
          name: '🎬 娱乐',
          proxies: fallbackProxies,
          ...(ruleOptionsEnable.分流组添加所有节点 && { 'include-all': true }),
        }]
      : []),
    // 保持 Flower.yaml 中的地区策略组顺序。
    regionGroups[2], // 日本
    regionGroups[0], // 香港
    regionGroups[1], // 新加坡
    regionGroups[3], // 台湾
    regionGroups[4], // 美国
    ...(ruleOptionsEnable.手动选择
      ? [{
          ...selectOption,
          name: '🇺🇳 全部',
          'include-all': true,
          ...(ruleOptionsEnable.自动选择 && { proxies: ['♻️ 自动选择'] }),
        }]
      : []),
    { ...selectOption, name: '🐟 漏网之鱼', proxies: fallbackProxies },
    ...(generateLowRateGroup
      ? [{ ...selectOption, name: '😊 低倍率', 'include-all': true, filter: '实验' }]
      : []),
    { ...selectOption, name: '➡️ 直连', hidden: true, proxies: ['DIRECT'] },
    { ...selectOption, name: '🏠 局域网', hidden: true, proxies: ['DIRECT'] },
    ...(ruleOptionsEnable.AdBlock
      ? [{ ...selectOption, name: '🚫 广告', proxies: ['REJECT', 'REJECT-DROP', 'PASS'] }]
      : []),
    ...regionAutoGroups,
    ...(ruleOptionsEnable.自动选择 ? [{ ...urlTestOption, name: '♻️ 自动选择' }] : []),
  ];
}

function createRuleProviders() {
  return {
    'fakeip-filter': createRuleProvider(domainProviderOption, 'meta/other/fakeip-filter.mrs'),
    private: createRuleProvider(domainProviderOption, 'meta/geosite/private.mrs'),
    ...(ruleOptionsEnable.AdBlock && {
      hagezi: createRuleProvider(domainProviderOption, 'meta/other/hagezi-pro.mini.mrs'),
    }),
    direct: createRuleProvider(domainProviderOption, 'hidden/rules/direct.mrs'),
    ...(ruleOptionsEnable.AI && {
      ai: createRuleProvider(domainProviderOption, 'meta/geosite/category-ai-!cn.mrs'),
    }),
    ...(ruleOptionsEnable.娱乐 && {
      entertainment: createRuleProvider(domainProviderOption, 'meta/geosite/category-entertainment.mrs'),
    }),
    ...(ruleOptionsEnable.Google && {
      google: createRuleProvider(domainProviderOption, 'meta/geosite/google.mrs'),
    }),
    cn: createRuleProvider(domainProviderOption, 'meta/geosite/cn.mrs'),
    'geolocation-!cn': createRuleProvider(domainProviderOption, 'meta/geosite/geolocation-!cn.mrs'),
    telegramcidr: createRuleProvider(ipProviderOption, 'meta/geoip/telegram.mrs'),
    cncidr: createRuleProvider(ipProviderOption, 'meta/geoip/cn.mrs'),
    lancidr: createRuleProvider(ipProviderOption, 'meta/geoip/private.mrs'),
  };
}

function main(config) {
  // 覆写机场配置时使用原有代理节点。
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];

  if (proxies.length === 0) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  return {
    proxies,
    'mixed-port': 7890,
    'allow-lan': false,
    ipv6: false,
    'unified-delay': true,
    'tcp-concurrent': true,
    'keep-alive-interval': 60,
    profile: { 'store-selected': true, 'store-fake-ip': true },
    ntp: {
      enable: true,
      'write-to-system': false,
      server: 'ntp.aliyun.com',
      port: 123,
      interval: 60,
    },
    tun: {
      enable: true,
      stack: 'mips',
      'auto-route': true,
      'auto-redirect': true,
      'auto-detect-interface': true,
      'dns-hijack': ['any:53', 'tcp://any:53'],
    },
    hosts: {
      'dns.alidns.com': ['223.5.5.5', '223.6.6.6'],
      'doh.pub': ['1.12.12.12', '120.53.53.53'],
      'dns.google': ['8.8.8.8', '8.8.4.4'],
      'cloudflare-dns.com': ['104.16.248.249', '104.16.249.249'],
    },
    dns: {
      enable: true,
      ipv6: false,
      'cache-algorithm': 'arc',
      'use-hosts': true,
      'use-system-hosts': true,
      'enhanced-mode': 'fake-ip',
      'fake-ip-range': '198.18.0.1/16',
      'fake-ip-filter': ['rule-set:fakeip-filter'],
      'default-nameserver': defaultDNS,
      'proxy-server-nameserver': chinaDNS,
      'direct-nameserver': chinaDNS,
      nameserver: getForeignDNS(),
    },
    'proxy-groups': createProxyGroups(),
    'rule-providers': createRuleProviders(),
    rules: [
      'RULE-SET,private,🏠 局域网',
      ...(ruleOptionsEnable.AdBlock ? ['RULE-SET,hagezi,🚫 广告'] : []),
      'RULE-SET,direct,➡️ 直连',
      ...(ruleOptionsEnable.AI ? ['RULE-SET,ai,🤖 AI'] : []),
      ...(ruleOptionsEnable.娱乐 ? ['RULE-SET,entertainment,🎬 娱乐'] : []),
      ...(ruleOptionsEnable.Google ? ['RULE-SET,google,🚀 默认'] : []),
      'RULE-SET,cn,➡️ 直连',
      'RULE-SET,geolocation-!cn,🚀 默认',
      'RULE-SET,lancidr,🏠 局域网,no-resolve',
      'RULE-SET,telegramcidr,🚀 默认,no-resolve',
      'RULE-SET,cncidr,➡️ 直连',
      'MATCH,🐟 漏网之鱼',
    ],
  };
}
