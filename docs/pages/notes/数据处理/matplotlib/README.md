---
title: matplotlib
sidebar: auto
tags:  
    - python
    - matplotlib
    - chart
---

# Matplotlib  
## 安装  
- 环境（Python2、Python3 共存，但是对Python2 未做验证）
  - Windows 10 Pro  
  - Python 2.7.18
  - Python 3.8.6

- 安装  
  ```bash
  # 最好在管理员权限下安装  
  
  # Python2 下安装
  py -2 -m pip install -U pip
  py -2 -m pip install -U numpy matplotlib

  # Python3 下安装
  py -3 -m pip install -U pip
  py -3 -m pip install -U numpy matplotlib
  ```

## 基本概念  
### Figure  
- Figure 包含所有的子坐标系（Axes），画布（Canvas），和少部分特殊元素，比如：标题、图例等  
- 一般来说每个Figure 至少应该有一个Axes  

#### 创建方法  
```python
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()  # 创建一个空的图形
fig, ax = plt.subplots()  # 创建一个只包含一个Axes 的图形
fig, axs = plt.subplots(2, 2)  # 创建包含4 个（2x2）Axes 的图形
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2)  # 解构赋值

# 参考API  
# https://matplotlib.org/api/_as_gen/matplotlib.pyplot.subplots.html#matplotlib.pyplot.subplots
```

### Axes   
- 与Figure 是多对一关系  
- Axes：包含数据空间的图像区域，可以视作笛卡尔坐标系     
  - 每个Axes 包含两个或更多坐标轴  
  - 每个Axes 包含自己的标题，`set_title()`
  - 每个Axes 可以设置坐标轴标签，`set_xlabel()`、`set_ylabel()`
  - 每个Axes 可以设置每个边框的颜色，`spines[n].set_color()`  
- Subplot：一种特殊的Axes，按行和列对其  

### Axis    
- 一系列`数字线`对象，大致可以类比于数组  

### Artist    
- 几乎所有可见的元素都是Artist，大概就是图元  
- 一般Artist 会被绑定在特定的Axes 上  


## 基本用法  
### 简单折线图  
```python
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()  # 创建一个包含一个坐标系的绘图区域
ax.plot([1, 2, 3, 4], [1, 4, 2, 3])  # 绘制点  
# 参考API 
# https://matplotlib.org/api/_as_gen/matplotlib.axes.Axes.plot.html#matplotlib.axes.Axes.plot  
# plot([x], y, [fmt], *, data=None, **kwargs)
# plot([x], y, [fmt], [x2], y2, [fmt2], ..., **kwargs)
```

### 参数类型  
所有的绘图函数接受`numpy.array` 和`numpy.ma.masked_array` 作为输入参数。而`类数组`对象，例如`pandas`和`numpy.matrix` 可能需要转化为`numpy.array` 才能使用。例如： 
```python
# 转化pandas.DataFrame
a = pandas.DataFrame(np.random.rand(4, 5), columns = list('abcde'))
a_asarray = a.values

# 转化numpy.matrix
b = np.matrix([[1, 2], [3, 4]])
b_asarray = np.asarray(b)
```

### 面向对象的接口和pyplot 的接口  
使用`Matplotlib` 主要有两种途径：  
1. 显式地创建图形和坐标系（面向对象风格）  
2. 依靠`pyplot` 自动创建并管理图形、坐标系，以及进行绘图工作  

#### 面向对象风格  
```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2, 100)

# 尽管是OO 风格，我们依然会采用`.pyplot.figure` 来创建figure
fig, ax = plt.subplots()  # 创建图形和坐标系
ax.plot(x, x, label='linear')  # 在坐标系中绘制直线
ax.plot(x, x**2, label='quadratic')  # 抛物线
ax.plot(x, x**3, label='cubic')  # 三次曲线
ax.set_xlabel('x label')  # x 轴标签
ax.set_ylabel('y label')  # y 轴标签
ax.set_title("Simple Plot")  # 标题
ax.legend()  # 图例
```  

#### pyplot 风格  
```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2, 100)

plt.plot(x, x, label='linear')  
plt.plot(x, x**2, label='quadratic') 
plt.plot(x, x**3, label='cubic')
plt.xlabel('x label')
plt.ylabel('y label')
plt.title("Simple Plot")
plt.legend()
```


### 

## 高级用法  

待续……

## 参考  
1. [同时装了Python3和Python2，怎么用pip？](https://www.zhihu.com/question/21653286)  
2. [Usage Guide](https://matplotlib.org/tutorials/introductory/usage.html)  
3. [python matplotlib中axes与axis的区别?](https://www.zhihu.com/question/51745620)
4. [Matplotlib入门简介](https://www.bootwiki.com/note/21095.html)