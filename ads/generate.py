# 从 rules/ 源文件生成 jiekouAD.yaml
from readme import ReadMe
from filter import Filter

readme = ReadMe('README.md')
ruleList = readme.getRules()
print("rules:", [(r.name, r.type, r.filename) for r in ruleList])
f = Filter(ruleList, 'rules')
f.generate(readme.getRulesNames())
