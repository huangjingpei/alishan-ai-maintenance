#!/usr/bin/env bash
# 逐文件标识符可读性清理驱动器（方法论 §6 落实版）
# 流程（每文件独立）：rename-hex --write -> residual.other==0 检查 ->
#   rename-fn-semantic --from-exports --write -> git HEAD 基线 -> verify-ast-equiv ->
#   validate 仓库门禁 -> 原子提交。
# 单文件任意门禁失败：回滚该文件（git checkout）并记入 SKIP，继续下一个，不阻塞整批。
# 用法: bash scripts/run-readability.sh <file-list.txt> [NODE_BIN]
set -u
cd "$(dirname "$0")/.." || exit 1
NODE_BIN="${2:-${NODE_BIN:-C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe}}"
LIST="${1:-.temp/hex-remaining.txt}"
LOG=".temp/run-readability.log"
: > "$LOG"
ok=0; skip=0
while read -r line; do
  f="${line##* }"
  [ -z "$f" ] && continue
  echo "==== $f ====" | tee -a "$LOG"
  out=$("$NODE_BIN" scripts/rename-hex.mjs "$f" --write 2>&1)
  if echo "$out" | grep -q "ERROR"; then
    echo "  !! rename error: $(echo "$out" | grep ERROR | head -1)" | tee -a "$LOG"
    echo "SKIP $f (rename error)" >> "$LOG"; skip=$((skip+1)); continue
  fi
  residual_other=$(echo "$out" | grep -oE "other=[0-9]+" | head -1 | cut -d= -f2)
  if [ "${residual_other:-0}" != "0" ]; then
    echo "  !! residual other=$residual_other != 0, revert" | tee -a "$LOG"
    git checkout -- "$f"
    echo "SKIP $f (residual other=$residual_other)" >> "$LOG"; skip=$((skip+1)); continue
  fi
  "$NODE_BIN" scripts/rename-fn-semantic.mjs "$f" --from-exports --write >/dev/null 2>&1
  if ! git show HEAD:"$f" > .temp/orig-check.js 2>/dev/null; then
    echo "  !! no HEAD baseline, revert" | tee -a "$LOG"
    git checkout -- "$f"; echo "SKIP $f (no HEAD baseline)" >> "$LOG"; skip=$((skip+1)); continue
  fi
  n=$(grep -oE "_0x[0-9a-f]{4,8}" .temp/orig-check.js | wc -l)
  if ! "$NODE_BIN" scripts/verify-ast-equiv.mjs .temp/orig-check.js "$f" >/dev/null 2>&1; then
    echo "  !! AST NOT EQUIVALENT, revert" | tee -a "$LOG"
    git checkout -- "$f"; echo "SKIP $f (not equivalent)" >> "$LOG"; skip=$((skip+1)); continue
  fi
  if ! "$NODE_BIN" --experimental-vm-modules scripts/validate.mjs >/dev/null 2>&1; then
    echo "  !! validate failed, revert" | tee -a "$LOG"
    git checkout -- "$f"; echo "SKIP $f (validate fail)" >> "$LOG"; skip=$((skip+1)); continue
  fi
  git add "$f"
  if git commit -q -m "refactor(readability): 清理 ${f#dist-protected/} 标识符（$n 处）"; then
    echo "  committed ($n 处)" | tee -a "$LOG"; ok=$((ok+1))
  else
    echo "  !! commit failed, revert" | tee -a "$LOG"
    git checkout -- "$f"; echo "SKIP $f (commit fail)" >> "$LOG"; skip=$((skip+1))
  fi
done < "$LIST"
echo "DONE ok=$ok skip=$skip" | tee -a "$LOG"
