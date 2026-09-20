from pathlib import Path
import re
root = Path(r"D:\XiaomiMiMoProjects\grow-up")
mission = (root / "out" / "mission" / "index.html").read_text(encoding="utf-8")
home = (root / "out" / "index.html").read_text(encoding="utf-8")
print("name", "赖潇语" in mission)
print("class", "小一班" in mission)
print("speech", "陌生人给的零食" in mission)
print("icons_home", re.findall(r'href="([^"]*favicon[^"]*)"', home))
print("icons_apple", re.findall(r'href="([^"]*apple-touch[^"]*)"', home))
print("mission_link", "/grow-up/mission" in home)
print("countdown_or_title", "防诱拐演练" in home)
