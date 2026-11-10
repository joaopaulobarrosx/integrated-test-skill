#!/usr/bin/env bash
# Installs the "integrated-test" skill for Claude Code.
#   ./install.sh                  global (~/.claude/skills), all projects
#   ./install.sh --project        only the current project (./.claude/skills)
#   ./install.sh --lang pt-BR     Portuguese version of the skill (name: teste-integrado)
# Combine flags as needed, e.g.: ./install.sh --project --lang pt-BR
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
scope="global"; lang="en"
while [ $# -gt 0 ]; do
  case "$1" in
    --project) scope="project" ;;
    --lang) shift; lang="${1:-en}" ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
if [ "$lang" = "pt-BR" ]; then src="$here/skill-pt-BR"; name="teste-integrado"; else src="$here/skill"; name="integrated-test"; fi
if [ "$scope" = "project" ]; then dest="$PWD/.claude/skills/$name"; else dest="$HOME/.claude/skills/$name"; fi
mkdir -p "$dest"
cp -R "$src/." "$dest/"
echo "Skill installed at: $dest"
echo "Restart Claude Code and ask for an \"integrated test\"."
if [ "$lang" = "pt-BR" ]; then tpl="projeto.modelo.md"; tgt="projeto.md"; else tpl="project.template.md"; tgt="project.md"; fi
echo "Tip: copy $dest/references/$tpl to $tgt and fill it in for your project."
