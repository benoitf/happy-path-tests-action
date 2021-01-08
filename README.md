# Eclipse Che - Install Github Action

This Github action will setup che with minikube on github with a github action

It will require ubuntu 18.04 instance type

# Usage

```yaml
# Install che
name: che

on:
  pull_request: 
    types: [opened, synchronize]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - name: Eclipse Che
        id: che-install-gh-action
        uses: benoitf/che-install-gh-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

