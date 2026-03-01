## MacOS Setup

1. Install [Brew](https://brew.sh/)
2. Install [fish shell](https://fishshell.com/)
    - `brew install fish`
    - Configure login shell to `/opt/homebrew/bin/fish`:
        - Follow directions at https://superuser.com/a/363555
3. Install [Alt-Tab](https://alt-tab-macos.netlify.app/)
4. Install [https://karabiner-elements.pqrs.org/](https://karabiner-elements.pqrs.org/)
5. Install [Alfred](https://www.alfredapp.com/)
6. Install [Typora](https://typora.io/)
7. Install [BTT](https://folivora.ai/downloads)
    1. [Import this trigger](btt://jsonimport/WwogIHsKICAgICJCVFRMYXN0VXBkYXRlZEF0IiA6IDE3NzIzOTU5ODIuNTA2MDEyOSwKICAgICJCVFRUcmlnZ2VyVHlwZSIgOiAxMDQsCiAgICAiQlRUVHJpZ2dlclR5cGVEZXNjcmlwdGlvblJlYWRPbmx5IiA6ICIzIEZpbmdlciBUYXAiLAogICAgIkJUVFRyaWdnZXJDbGFzcyIgOiAiQlRUVHJpZ2dlclR5cGVUb3VjaHBhZEFsbCIsCiAgICAiQlRUVVVJRCIgOiAiRDUwQjUxRUMtQ0M0NC00NERFLUIwMzgtNTYyNkI2NUJBODIzIiwKICAgICJCVFRSZXF1aXJlZE1vZGlmaWVyS2V5cyIgOiAwLAogICAgIkJUVE9yZGVyIiA6IDAsCiAgICAiQlRUQWN0aW9uc1RvRXhlY3V0ZSIgOiBbCiAgICAgIHsKICAgICAgICAiQlRUTGFzdFVwZGF0ZWRBdCIgOiAxNzcyMzk2MDA0LjYyMjgxMywKICAgICAgICAiQlRUVHJpZ2dlclBhcmVudFVVSUQiIDogIkQ1MEI1MUVDLUNDNDQtNDRERS1CMDM4LTU2MjZCNjVCQTgyMyIsCiAgICAgICAgIkJUVElzUHVyZUFjdGlvbiIgOiB0cnVlLAogICAgICAgICJCVFRUcmlnZ2VyQ2xhc3MiIDogIkJUVFRyaWdnZXJUeXBlVG91Y2hwYWRBbGwiLAogICAgICAgICJCVFRVVUlEIiA6ICI5NjUyRkIxMC1GNDZFLTQ2NzktOEE3MS1FMkUwOTdERkREM0UiLAogICAgICAgICJCVFRQcmVkZWZpbmVkQWN0aW9uVHlwZSIgOiAyLAogICAgICAgICJCVFRQcmVkZWZpbmVkQWN0aW9uTmFtZSIgOiAiQ01EKOKMmCkrQ2xpY2siLAogICAgICAgICJCVFRPcmRlciIgOiAxCiAgICAgIH0KICAgIF0sCiAgICAiQlRUVHJpZ2dlckNvbmZpZyIgOiB7CiAgICAgICJCVFROb1RvdWNoVGltZW91dCIgOiAwCiAgICB9CiAgfQpd)

8. Install [SmartGit](https://www.smartgit.dev/download/)

### Use this repository

```
brew install gh
brew install starship
brew install fnm
cd ~
gh repo clone zastrowm/system .system
```

Set `~/.config/fish/config.fish` to:

```
source ~/.system/config/shared.fish
```

Update karbiner:

```shell
ln -s "$HOME/.system/config/karabiner" "$HOME/.config"
```

### Final Setup

```shell
# Always show hidden files
# https://apple.stackexchange.com/questions/302954/permanently-enable-to-show-hidden-system-files-when-searching-in-finder
defaults write com.apple.finder AppleShowAllFiles -boolean true; killall Finder;

# Use shared git ignored
git config --global core.excludesFile '~/.system/config/.gitignore'
```

Update shell to `fish`:

```shell
sudo dscl . -create /Users/$USER UserShell $(which fish)
sudo dscl . change /users/$USER UserShell /bin/bash $(which fish)
```



## Troubleshooting

### Debugging slow Fish startup

- Check `~/.config/fish/conf.d` and see if Q put crap in there
  - I had a `~/.config/fish/conf.d/00_fig_pre.fish` & `~/.config/fish/conf.d/99_fig_post.fish`