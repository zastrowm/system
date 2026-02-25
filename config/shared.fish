if status is-interactive
  # Commands to run in interactive sessions can go here
end

set fish_greeting

fish_add_path /opt/homebrew/bin
fish_add_path "~/Library/Application Support/JetBrains/Toolbox/scripts"
fish_add_path ~/Library/Android/sdk/platform-tools
fnm env --use-on-cd | source


alias nvm fnm

set -x STARSHIP_CONFIG ~/.system/config/starship.toml
starship init fish | source

# Go to our workspace
function ws 
  cd ~/workspace
end

# Refresh the config
function refresh
  source ~/.system/config/shared.fish
end

function init_conda
  fish_add_path ~/miniconda3/bin
  eval "$(~/miniconda3/bin/conda shell.fish hook)"
end

test -e {$HOME}/.iterm2_shell_integration.fish ; and source {$HOME}/.iterm2_shell_integration.fish
