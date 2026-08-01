#!/usr/bin/env python3
"""
从 模块级排期v4.xlsx 生成前端 mock 数据 src/mock/schedule/scheduleData.ts
用法: python3 scripts/generateScheduleMock.py
"""

import json
import openpyxl
from collections import OrderedDict

XLSX = "模块级排期v4.xlsx"
OUT = "src/mock/schedule/scheduleData.ts"

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb["难度系数与人天"]
rows = list(ws.iter_rows(values_only=True))
data = rows[1:]

items = []
cur = {"sys": None, "sub": None, "mod": None}
for idx, r in enumerate(data):
    if r[1]:
        cur["sys"] = r[1]
    if r[2]:
        cur["sub"] = r[2]
    if r[3]:
        cur["mod"] = r[3]
    module = cur["mod"] or cur["sub"]
    item = {
        "id": idx + 1,
        "systemName": cur["sys"],
        "subsystemName": cur["sub"],
        "moduleName": module,
        "itemName": r[4].strip() if r[4] else "",
        "complexity": r[5],
        "personDays": int(r[6] or 0),
        "startDate": r[7].strftime("%Y-%m-%d") if r[7] else "",
        "endDate": r[8].strftime("%Y-%m-%d") if r[8] else "",
        "team": r[9] or "",
    }
    items.append(item)

# 模块级聚合
modules = OrderedDict()
for item in items:
    key = (item["systemName"], item["subsystemName"], item["moduleName"])
    mod = modules.setdefault(
        key,
        {
            "key": "/".join(key),
            "systemName": item["systemName"],
            "subsystemName": item["subsystemName"],
            "moduleName": item["moduleName"],
            "itemCount": 0,
            "personDays": 0,
            "startDate": None,
            "endDate": None,
            "teams": [],
            "items": [],
        },
    )
    mod["itemCount"] += 1
    mod["personDays"] += item["personDays"]
    if mod["startDate"] is None or item["startDate"] < mod["startDate"]:
        mod["startDate"] = item["startDate"]
    if mod["endDate"] is None or item["endDate"] > mod["endDate"]:
        mod["endDate"] = item["endDate"]
    for t in item["team"].split("+"):
        if t and t not in mod["teams"]:
            mod["teams"].append(t)
    mod["items"].append(item)

module_list = list(modules.values())
for mod in module_list:
    mod["teamText"] = "+".join(mod["teams"])

# 团队信息
TEAMS = [
    {"name": "A组", "frontend": "李圳飞", "backend": "谢绍标"},
    {"name": "B组", "frontend": "戴世杰", "backend": "张鑫润"},
    {"name": "C组", "frontend": "李开翔", "backend": "何康跃"},
    {"name": "D组", "frontend": "", "backend": ""},
    {"name": "E组", "frontend": "", "backend": ""},
]

header = """/**
 * 模块级排期 Mock 数据
 * 由 scripts/generateScheduleMock.py 自动生成，请勿手动修改
 * 数据来源：模块级排期v4.xlsx（难度系数与人天表）
 */
import type { ScheduleItem, ScheduleModule, ScheduleTeam } from '@/types/schedule'

"""

body = f"""export const mockScheduleItems: ScheduleItem[] = {json.dumps(items, ensure_ascii=False, indent=2)}

export const mockScheduleModules: ScheduleModule[] = {json.dumps(module_list, ensure_ascii=False, indent=2)}

export const mockScheduleTeams: ScheduleTeam[] = {json.dumps(TEAMS, ensure_ascii=False, indent=2)}
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + body)

print(f"生成完成: {OUT}")
print(f"功能项: {len(items)} 条, 模块: {len(module_list)} 个")
