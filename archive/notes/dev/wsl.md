---
title: WSL  
sidebar: auto  
tags:  
    - linux  
    - xming  
    - gui  
    - wsl
---  

# WSL  
整理记录一些使用WSL 的问题。关于WSL 的安装，微软已经有了很完善的[文档](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)，按照文档一步步安装即可  

## 配置GUI  
WSL 本身是不带GUI 界面的，一般教程会采用安装`xface` 使用桌面环境。但是我们也可以采用`X-Server` 来将WSL 的显示转发到Windows 宿主机。常用的`X-Server` 服务端有[Xming](https://sourceforge.net/projects/xming/files/Xming/6.9.0.31/Xming-6-9-0-31-setup.exe/download)、[VcXSrv](https://sourceforge.net/projects/vcxsrv/)、与[X410(收费)](https://x410.dev/)。其中，Xming 已经很久没更新了，所以首推VcXSrv，如果不在意成本的话X410 是最好的选择，因为前两款看起来分辨率都有点怪怪的。  
### 配置服务端  
对于X410 保持默认配置就好，而对于上面两个开源的服务端，一般安装后都会有一个`XLaunch` 应用，启动这个应用，仅需修改两个地方，其余的保持默认下一步直到结束即可：  
1. Display Number: 一般默认修改为0  
2. Disable access control: 如果不勾选在WSL2 中会有问题  

### 配置WSL  
WSL2 与WSL1 的配置稍有不同，其中WSL2 更像是真正的虚拟机，所以配置要稍微复杂一点。  

#### 配置WSL1  
WSL1 与宿主机公用IP 和端口号，所以配置比较简单，只需添加一个环境变量即可：  
```bash
echo "export DISPLAY=:0" >> ${HOME}/.bashrc
. $HOME/.bashrc 
```

#### 配置WSL2  
因为WSL2 有自己独立的IP，所以需要提前在宿主机上获取宿主机的IP（WSL 虚拟网卡上的IP）  
```bash
# powershell on win10  
(ipconfig | Select-String -Pattern 'WSL' -Context 1, 5).Context.PostContext | Select-String -Pattern 'IPv4'  
``` 

将获取到的IP 记录，并在WSL2 中添加环境变量：  
```bash
# bash in ubuntu 
# 将{Windows IP} 用上面获取到的IP 替换
# 此IP 一般不会轻易改变，请放心使用
echo "export DISPLAY={Windows IP}:0" >> ${HOME}/.bashrc  
. $HOME/.bashrc
```

### 测试  
我们可以在WSL(2) 中安装`x11-apps`，然后用来测试GUI 的配置是否成功  
```bash
sudo apt-get install x11-apps  

xclock # 如果在桌面上启动了一个时钟，就证明配置是成功的  
```

## 小技巧  
下面是具体使用时的一些小技巧，使用可能有风险（虽然还未发现）。

### 共享网络
因为WSL1 与宿主机共享网络，包括VPN 设置。所以我们可以在下载安装软件时将WSL 转化为WSL1，安装完之后再转化为WSL2。这样就不用在WSL 中单独配置小飞机了。  
```bash  
# 下面命令需要在宿主机中执行  
# 执行时请确保WSL 没有正在运行的任务  
wsl --set-version Ubuntu-18.04 1 # 降级为wsl1 
wsl --set-version Ubuntu-18.04 2 # 升级为wsl2
```

### LxRunOffline  
这款工具可以视为wsl 命令的加强版，可以实现将wsl 子系统的安装目录转移到其他盘，以减少系统盘的占用，下面仅列出常用的命令：  

1. 列出当前运行的子系统：`LxRunOffline l`  
2. 子系统迁移：`lxrunoffline m -n <子系统名称> -d <新的路径>`  
3. 查看子系统路名：`lxrunoffline di -n <子系统名称>`

### Qt5 的问题  
在WSL1 中，使用`OpenFoam` 或者`OpenModelica` 的时候可能会报异常：  
> [error while loading shared libraries: libQt5Core.so.5: cannot open shared object file: No such file or directory](https://stackoverflow.com/questions/64588549/paraview-error-while-loading-shared-libraries-libqt5core-so-5-cannot-open-sha)

可以通过在删除`libQtCore` 中的`.note.ABI-tag` 节来修复。  
```bash
sudo strip --remove-section=.note.ABI-tag /usr/lib/x86_64-linux-gnu/libQt5Core.so.5

# .note.ABI-tag
#   This section is used to declare the expected run-time ABI
#   of the ELF image.  It may include the operating system name
#   and its run-time versions.  This section is of type
#   SHT_NOTE.  The only attribute used is SHF_ALLOC.
# 此节用于标识二进制文件与内核兼容的信息
# 如果链接库不是针对于特定内核编译的，则可以切掉
```

## 参考链接
1. [适用于 Linux 的 Windows 子系统安装指南 (Windows 10)](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)
2. [Configure Xming display on WSL2](https://stackoverflow.com/questions/63246287/configure-xming-display-on-wsl2)  
3. [OpenFOAM for Windows 10](https://openfoam.org/download/windows-10/)  
4. [关于在 WSL Ubuntu 中不能启动 Qt 应用的问题。](https://zhuanlan.zhihu.com/p/140460014)  
5. [ELF中“ .note.ABI-tag”部分的意义是什么？](https://www.thinbug.com/q/53363275)