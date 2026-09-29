# Apply review-team findings (reviews/*.json) to the book files; log every decision.
import json, glob, os, collections
SD = os.path.dirname(os.path.abspath(__file__))
ORDER = ["truth", "science_a", "science_b", "copyright", "proof_en_a", "proof_en_b", "tamil_a", "tamil_b"]
def path_for(f, lang):
    if f.endswith(".md"): return os.path.join(SD, "content_ta" if lang == "ta" else "content", f)
    if f in ("strings.json", "figures_ta.json"): return os.path.join(SD, "content_ta", f)
    return os.path.join(SD, f)
log = []; stats = collections.Counter(); ta_needed = []
LOGP = os.path.join(SD, "reviews", "_applied_log.json")
prev = json.load(open(LOGP, encoding="utf8")) if os.path.exists(LOGP) else []
done = {(r["team"], r["file"], r["old"]) for r in prev if r.get("result") == "applied"}
log = [r for r in prev if r.get("result") == "applied"]
files = {}
for team in ORDER:
    p = os.path.join(SD, "reviews", team + ".json")
    if not os.path.exists(p): continue
    for fd in json.load(open(p, encoding="utf8")):
        lang = fd.get("lang", "en"); fp = path_for(fd["file"], lang)
        rec = {"team": team, **fd}
        if (team, fd["file"], fd["old"]) in done: stats["already_applied"] += 1; continue
        if fd.get("new") is None: stats["flag_only"] += 1; rec["result"] = "flag-only (needs author)"; log.append(rec); continue
        if not os.path.exists(fp): stats["missing_file"] += 1; rec["result"] = "file not found"; log.append(rec); continue
        if fp not in files: files[fp] = open(fp, encoding="utf8").read()
        txt = files[fp]; old, new = fd["old"], fd["new"]
        if "\n" in new or "\n" in old: stats["multiline"] += 1; rec["result"] = "rejected: multi-line"; log.append(rec); continue
        n = txt.count(old)
        if n != 1: stats["not_unique" if n else "not_found"] += 1; rec["result"] = f"skipped: found {n}x"; log.append(rec); continue
        files[fp] = txt.replace(old, new, 1); stats["applied"] += 1; rec["result"] = "applied"; log.append(rec)
        if lang == "en" and fd.get("category") in ("fact", "science", "copyright", "attribution", "consistency"):
            ta_needed.append(fd["file"])
for fp, txt in files.items(): open(fp, "w", encoding="utf8").write(txt)
json.dump(log, open(LOGP, "w"), ensure_ascii=False, indent=1)
print(dict(stats)); print("EN files with substantive changes needing Tamil sync:", sorted(set(ta_needed)))
