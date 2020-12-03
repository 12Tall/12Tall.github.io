---
title: 自动控制原理  
# sidebar: auto  
---  
# 自动控制原理  

## 控制系统分析  
### 线性系统的时域分析与校正  
时域法是学习复域法的基础：直观、包含系统时间响应的全部信息、比较繁琐。一旦结构调整，需要重新计算解析解。对于高阶系统较为复杂，在校正中较为繁琐。  

::: details 时域分析常用信号 
- 单位脉冲 $\delta(t)$  
- 单位阶跃 $u(t)$  
- 单位斜坡 $t$  
- 单位加速度 $\frac{t^2}{2}$  

自下而上一次是求导的关系  
计算动态特性时常用阶跃函数作为输入  
:::  
::: details 动态性能指标  
动态性能指标都是对阶跃响应而言的  
1. 延迟时间$t_{d}$: 阶跃响应第一次达到终值50% 所需的时间  
2. 上升时间$t_{r}$: 阶跃响应从终值的10% 上升到90% 所需的时间；  
   有震荡时，可定义为从0 到第一次达到终值所需的时间  
3. 峰值时间$t_{p}$: 阶跃响应超过终值达到第一个峰值所需的时间  
4. 超调量$\sigma\%$：峰值超出终值的百分比  
5. 调节时间$t_{s}$： 阶跃响应达到并稳定在终值$\pm 5\%$ 误差带内所需的最短时间
:::

#### 一阶线性系统的时间响应及动态性能  
##### 注意  
1. 开环传递函数  
2. 开环增益 
3. 梅森增益公式的应用   
 
开环传递函数：  
$$G(s) = \frac{K}{s}$$ 
传递函数是一阶的标准形式：
$$\Phi(s) = \frac{ \frac{K}{s} }{ 1 + \frac{K}{s}} = \frac{K}{s + K} \overset{T=\frac{1}{K}}{\Rightarrow} \frac{1}{Ts + 1}$$  
惯性环节。T 是时间常数  
$$C(s) = \Phi (s) R(s) = \frac{1}{s} \frac{1}{s+ \frac{1}{T}}$$  
直接反变换，可以得到其单位阶跃响应  
$$h(t) = L^{-1} [C(s)] = 1-e^{- \frac{t}{T}}$$

动态性能指标：  
1. t=1T : 0.623  
2. t=2T : 0.865  
3. t=3T : 0.95  
4. t=4T : 0.982 

简单的校正：根据校正建议，写出梅森增益公式，然后待定系数法确定具体数值。

一条重要关系：**系统对信号的微分/积分的响应等于系统对该信号响应的微分/积分。**

#### 二阶线性系统的时间响应及动态性能  
标准开环传递函数：  
$$G(s) = \frac{ \omega_n^2 }{ s(s + 2\xi \omega_n) }$$
闭环传递函数：  
$$\Phi(s) = \frac{ \omega_n^2 }{ s^2 + 2\xi \omega_n s + \omega_n^2 }$$  

二阶系统通常采用首1 型。  
- $\omega_n$：无阻尼自然频率  
- $\xi$：阻尼比，与极点分布有关    
  - $0 = \xi$：0 阻尼。阶跃响应为正弦曲线  
  - $0 < \xi < 1$：欠阻尼  
  - $1 = \xi$：临界阻尼
  - $1 < \xi$：过阻尼。相当于两个惯性环节串联，响应速度快的往前靠，两个极点距离越远，越接近于最后一个惯性环节的曲线。  
    - 特征根：$\lambda_1 = -\frac{1}{T_1}, \lambda_2 = -\frac{1}{T_2}$。
    - 超调为0，
    - 响应时间查表。  
  
二阶系统的特征方程：  
$$D(s) = s^2 + 2\xi \omega_n s + \omega_n^2 = 0$$  

##### 二阶线性系统欠阻尼系统分析  
特征方程有两个复根：
$$  
\begin{aligned}
& \lambda_{1,2} = \sigma \pm j\omega_d = \xi \omega_n \pm j \sqrt{1 - \xi^2} \omega_n \\
   
& |\lambda| = \omega_n  \\
& \angle \lambda = \beta  \\

& \cos{\beta} = \xi   \\
& \sin{\beta} = \sqrt{1 - \xi^2} 
\end{aligned}
$$  

单位阶跃响应推导：  
$$
\begin{aligned}
   C(s)& = \Phi(s) R(s) = \frac{\omega_n^2}{s^2 + 2\xi\omega_ns + \omega_n^2} \frac{1}{s} \\  

   & = \frac{[s^2 + 2\xi\omega_ns + \omega_n^2] - s(s + 2\xi\omega_n)}{s(s^2 + 2\xi\omega_ns + \omega_n^2)}  \\  
   & = \frac{1}{s} - \frac{s + 2\xi\omega}{(s + \xi\omega_n)^2 + (1 - \xi^2)\omega_n^2}  \\  

   & = \frac{1}{s} - \frac{s + \xi\omega}{(s + \xi\omega_n)^2 + (1 - \xi^2)\omega_n^2} - \frac{\xi}{\sqrt{1-\xi^2}} \frac{\sqrt{1-\xi^2}\omega_n}{(s + \xi\omega_n)^2 + (1 - \xi^2)\omega_n^2}  \\  

    \text{利用复位移定理：}  \\
     & L[f(t)e^{-at}] = F(s+a) \\   
   \text{系统的单位阶跃响应为：}  \\
    h(t) & = 1 - e^{-\xi\omega_nt} \cos{\sqrt{1- \xi^2}\omega_nt} - \frac{\xi}{\sqrt{1- \xi^2}}e^{-\xi\omega_nt}\sin{\sqrt{1- \xi^2}\omega_nt} \\  
   & = 1 - \frac{e^{-\xi\omega_nt}}{\sqrt{1- \xi^2}}  [\sqrt{1- \xi^2}\cos{\sqrt{1- \xi^2}\omega_nt} - \xi\sin{\sqrt{1- \xi^2}\omega_nt}] \\
   & = 1 - \frac{e^{-\xi\omega_nt}}{\sqrt{1- \xi^2}}  [\sin{\beta}\cos{\sqrt{1- \xi^2}\omega_nt} - \cos{\beta}\sin{\sqrt{1- \xi^2}\omega_nt}] \\ 
   & = 1 - \frac{e^{-\xi\omega_nt}}{\sqrt{1- \xi^2}} \sin{( \sqrt{1- \xi^2}\omega_nt + \beta)} & (0 \le \xi < 1) \\ 

  \text{当} \xi = 0: \\ 
   h(t) &= 1-\cos{(\omega_nt)}  \\
  \text{当} \xi > 0: \\ 
   & \text{去掉三角函数部分可以得到衰减的包络线} \\  
   \text{超调量：} &  t_p = \frac{\pi}{\sqrt{1-\xi^2}\omega_n}, h(t_p) = 1+ e^{\frac{-\xi\pi}{\sqrt{1-\xi^2}}} \\
   & \text{对拉式变换求导，也就是闭环传递函数本身，然后再反变换} \\  
   & \text{超调量只和阻尼比有关，而且阻尼比与}\beta\text{相关，所以在同一条射线上的超调量都一样}  \\
   & \text{记的时候结合}\beta \text{角去记}  \\
   \text{调节时间：} & \\  
   & \text{工程上为了方便起见，以包络线进入5\% 误差带的时间} \\  
   & ≈ \frac{3.5}{\xi\omega_n} & \Delta \le 5\% \\
   &  ≈ \frac{4.5}{\xi\omega_n} & \Delta \le 2\% 
\end{aligned}
$$
最佳阻尼比：$\xi = 0.707$，调节时间为$\frac{2}{\xi\omega_n}$，也就是$\beta = 45 \degree$ 时，调节时间最小   

在计算例题时，注意响应的稳态值也是一个重要参数。利用拉氏变换的终值定理，可以帮助确定一个参数  
$$h(\infty) = \lim\limits_{s \rightarrow 0} s \Phi(s) R(s) = C$$  

极点实部影响包络线收敛速度，虚部影响阻尼振荡频率。所以极点向上移动，收敛速度不变，但是振荡频率增加，超调量增加，调节时间近似不变；向左移，超调量会减少，调节时间会缩短。而且是成比例关系  


##### 重点链接
[欠阻尼系统求解，极点移动对系统参数的影响 -- 对于后面学习非常重要](https://www.bilibili.com/video/BV1ix411r7vg?p=18&t=203)
#### 高阶线性系统的时间响应及动态性能  

#### 线性系统的稳定性分析  

#### 线性系统的稳态误差   

#### 线性系统的时域校正  

## 控制系统校正



## 目录
1. [基本概念](./基本概念.md)  
2. [线性系统的时域分析与校正](./线性系统的时域分析与校正.md)