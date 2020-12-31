
```yml
# This is a basic workflow to help you get started with Actions
# 最基本的workflow 工作流

name: CI

# Controls when the action will run. 
# action 触发事件
on:
  # Triggers the workflow on push or pull request events but only for the master branch  
  # 只有在master 分支push 或pull request 时出发时间
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

  # Allows you to run this workflow manually from the Actions tab
  # 允许手动在Actions 面板执行workflow
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
# 一个workflow 由一个或多个顺序执行的job 组成
jobs:
  # This workflow contains a single job called "build"
  # 这个workflow 只包含一个build job
  build:
    # The type of runner that the job will run on
    # job 的运行环境
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    # job 中包含顺序执行的任务
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      # 检出$GITHUB_WORKSPACE 下的仓库代码，使job 可以访问
      - uses: actions/checkout@v2

      # Runs a single command using the runners shell
      # 运行一个shell 命令
      - name: Run a one-line script
        run: echo Hello, world!

      # Runs a set of commands using the runners shell
      # 运行一系列命令
      - name: Run a multi-line script
        run: |
          echo Add other actions to build,
          echo test, and deploy your project.

```