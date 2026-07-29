#!/usr/bin/env bash
# 洛的工作台 · 一键部署到 GitHub Pages
# 用法：
#   1) 在 GitHub 生成 Personal Access Token（勾选 repo 权限）
#   2) 给本脚本加执行权限：chmod +x deploy.sh
#   3) 运行：./deploy.sh <你的GitHub用户名> <新仓库名> <你的Token>
#
# 例：./deploy.sh luo-user luo-workbench ghp_xxxxxxxxxxxx
# 部署后访问：https://<用户名>.github.io/<仓库名>/

set -e
USER="$1"
REPO="$2"
TOKEN="$3"

if [ -z "$USER" ] || [ -z "$REPO" ] || [ -z "$TOKEN" ]; then
  echo "用法: ./deploy.sh <GitHub用户名> <仓库名> <Token>"
  exit 1
fi

echo "==> 创建仓库 $USER/$REPO ..."
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$REPO\",\"description\":\"洛的工作台 - 移动端学习生活统筹\",\"auto_init\":true,\"public\":true}" \
  "https://api.github.com/user/repos" > /dev/null

echo "==> 初始化并推送 ..."
git init -q
git config user.name "$USER"
git config user.email "$USER@users.noreply.github.com"
git checkout -b main 2>/dev/null || git checkout -b master
git add -A
git commit -q -m "feat: 洛的工作台 v1.0"
git remote remove origin 2>/dev/null || true
git remote add origin "https://oauth2:${TOKEN}@github.com/${USER}/${REPO}.git"
git branch -M main
git push -u origin main -f

echo "==> 开启 GitHub Pages ..."
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":{"branch":"main","path":"/"}}' \
  "https://api.github.com/repos/${USER}/${REPO}/pages" > /dev/null || true

echo "✅ 完成！稍等 1-2 分钟，浏览器访问："
echo "   https://${USER}.github.io/${REPO}/"
echo "   用手机 Chrome 打开该地址 → 菜单 → 安装应用，即可添加到桌面。"
