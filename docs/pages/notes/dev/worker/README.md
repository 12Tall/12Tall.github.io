---
title: Worker  
sidebar: auto  
tags: 
    - C#  
    - .net
    - dotnet  
    - core
    - service  
    - windows  
    - linux
--- 

# Worker  
## 简单示例
### 创建项目    
首先需要安装`.netcore 3.0` 及以上的开发环境   
```shell
# 1. 创建Worker 项目  
dotnet new worker  # 此命令会创建两个类`Program.cs`, `Worker.cs` 后面介绍  

# 2. 测试服务  
dotnet run  # 每隔一秒打印当前时间  
```

### 部署项目  
1. 要部署到项目中，需要添加额外的Nuget 包  

```shell
# Windows 
dotnet add package Microsoft.Extensions.Hosting.WindowsServices  

# Linux  
dotnet add package Microsoft.Extensions.Hosting.Systemd
```
2. 在`Program.cs` --> `CreateHostBuilder()` 中，注入命令  

```csharp {3-4}
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseWindowsService()  // Windows
        // .UseSystemd()  // Linux
        .ConfigureServices((hostContext, services) => {
            services.AddHostedService<Worker>();
        });
```  

3. 发布部署  
```shell  
# 3.1 发布项目
dotnet publish  -c Release -o {path}  

# Windows  
# 创建服务
sc.exe create {ServiceName} binPath={path/{可执行程序名}}  

# 查看服务状态  
sc.exe query {ServiceName} 

# 启动、停止、删除服务  
sc.exe start {ServiceName} 
sc.exe stop DemoWorkService 
sc.exe delete DemoWorkService 

# Linux 请参考：https://blog.csdn.net/zxcv1234zx12/article/details/86305004  
```  

## 项目介绍  
### Program.cs  
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace worker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            // 依赖注入
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();
                });
    }
}
```


### Worker.cs  
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
        }

        // 真正的服务入口
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // 实际应用中可以不用一直判断任务取消的状态
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}

```

简单的demo 并没有什么用处，后面还要填充具体的功能


## 参考资料  
1. [.NET Core3.0创建Worker Services](https://www.cnblogs.com/chengtian/p/11726540.html)  
2. [linux把程序安装成服务](https://blog.csdn.net/zxcv1234zx12/article/details/86305004)  
3. [Host ASP.NET Core in a Windows Service](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/windows-service?view=aspnetcore-3.1&tabs=netcore-cli)
4. [多线程笔记-CancellationToken（取消令牌）](https://www.cnblogs.com/fanfan-90/p/12660996.html)