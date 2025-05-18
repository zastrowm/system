## MacOS Setup

- Configure login shell to `/opt/homebrew/bin/fish`:
  - Follow directions at https://superuser.com/a/363555

Set `~/.config/fish/config.fish` to:

```
source ~/.system/config/shared.fish
```

### Configure Global Scripts

```
git config --global core.excludesFile '~/.system/config/.gitignore'
```

## Troubleshooting

### Debugging slow Fish startup

- Check `~/.config/fish/conf.d` and see if Q put crap in there
  - I had a `~/.config/fish/conf.d/00_fig_pre.fish` & `~/.config/fish/conf.d/99_fig_post.fish`