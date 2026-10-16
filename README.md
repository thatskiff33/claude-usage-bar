# claude-usage-bar

A Claude Code plugin that shows your 5-hour and weekly usage limits as bar graphs just above the prompt, so you always know how much headroom you have left and when it resets.

![5-hour and 7-day usage bars above the Claude Code prompt](docs/weekly.png)

With the weekly limit turned off, the 5-hour bar gets the full width:

![5-hour usage bar on its own](docs/five-hour.png)

## What it shows

- **5h** – the rolling 5-hour usage window
- **7d** – the 7-day usage window (on by default, can be turned off)
- How much of each window you've used, as a bar and a percentage
- A countdown to when each window resets

The bar changes colour as you use more:

| Usage    | Colour |
| -------- | ------ |
| < 70%    | green  |
| 70–89%   | yellow |
| 90%+     | red    |

The bar updates whenever Claude Code reports new rate-limit data. It stays hidden until there's usage data to show.

## Install

```sh
claude plugin marketplace add thatskiff33/claude-usage-bar
claude plugin install usage-bar@claude-usage-bar
```

Or from inside Claude Code:

```
/plugin marketplace add thatskiff33/claude-usage-bar
/plugin install usage-bar@claude-usage-bar
```

Restart Claude Code (or run `/reload-plugins`) and the bar appears above the prompt.

## Options

| Option              | Default | Description                                     |
| ------------------- | ------- | ----------------------------------------------- |
| Show weekly usage   | on      | Also show the 7-day usage limit on the same line |

To change it, run `/plugin configure usage-bar@claude-usage-bar` inside Claude Code, then restart.

## Updating

```sh
claude plugin marketplace update claude-usage-bar
claude plugin update usage-bar@claude-usage-bar
```

## Uninstall

```sh
claude plugin uninstall usage-bar@claude-usage-bar
```
