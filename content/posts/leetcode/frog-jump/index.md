---
title: "LeetCode 403. 青蛙过河"
slug: frog-jump
description:
date: 2024-03-14T20:55:41+08:00
draft: false
featuredImage:
math: false
hidden: false
categories:
  - leetcode
tags:
  - leetcode
  - oa
  - sliding-window
---

## 1. 题目介绍

原题链接：[403. 青蛙过河](https://leetcode.cn/problems/frog-jump/)，难度：**Hard**。

> 一只青蛙想要过河。假定河流被等分为若干个单元格，并且在每一个单元格内都有可能放有一块石子（也有可能没有）。青蛙可以跳上石子，但是不可以跳入水中。
>
> 给你石子的位置列表  `stones`（用单元格序号  **升序**  表示），  请判定青蛙能否成功过河（即能否在最后一步跳至最后一块石子上）。开始时，  青蛙默认已站在第一块石子上，并可以假定它第一步只能跳跃  `1`  个单位（即只能从单元格 1 跳至单元格 2 ）。
>
> 如果青蛙上一步跳跃了  `k`  个单位，那么它接下来的跳跃距离只能选择为  `k - 1`、`k`  或  `k + 1`  个单位。  另请注意，青蛙只能向前方（终点的方向）跳跃。

对我个人有很深意义的一道题，很久之前面试微软时遇到的题，结果时隔多年我忘记怎么做了......

## 2. 问题分析

首先想到的是能不能通过穷举列出所有的可能性，然后发现穷举起来也挺麻烦的，难度可能不亚于想一个更靠谱的算法了，那么继续试试其他的路子。

能否跳到最终的石头，取决于能否跳到上一个石头的步数 `k`，能否恰好在 `[k - 1, k + 1]` 之间；那能否跳到上一个石头，取决于......于是我们闻到了一丝动态规划的味道。

因为这是一只遗忘了游泳的青蛙，只能挑到石头上，并且每次跳只能是 `k` 个单位，那我们从两个方向考虑：

1. 青蛙起跳时，如果上一次跳跃了 `k` 个位置来到了当前位置 `i` ，那么下一次跳跃只能跳到 `i + k - 1`、`i + k`、`i + k + 1` 这三个位置，如果目的位置有石头的话，我们就可以晚一点想象这只可怜的青蛙溺水的样子。简单来说就是**从当前位置，可以跳到哪里**。
2. 青蛙跳到了某个石头 `i` 时，如果知道了上次起跳的石头位置 `j`，那么显然上次跳跃的距离为 `k = i - j`。如果我们知道了所有能跳到当前石头 `i` 的距离 `k`，那么我们可以根据上一步酸楚青蛙能够跳到的下一个石头的位置。也就是**从哪里能够跳到当前位置**

结合这两点，我们发现需要维护一个重要的信息：**从位置 `i` 能否跳跃到 `j`**。这也是这道题的关键，能否想到使用一个二维数组，通过 `dp[i][j]` 的方式来表示能否从位置 `i` 跳到 `j`。

有了 `dp[i][j]` 之后，只需要遍历石头的位置，每次跳到位置 `j` 时，找到所有能跳到 `j` 的位置 `i`，记录下跳跃的距离，再分别记录能跳跃到的目标位置 `j + k - 1`、`j + k`、`j + k + 1` 是否有石头即可。

如果发现恰好能挑到最后一块石头，即可结束遍历。

有一些可以减少内存占用的优化。根据题目给出的数据范围，石块的位置可能远大于石块的数量， 可以使 `dp[i][j]` 中的 `i` 和 `j` 分别表示石块在 `stones` 的索引。另外只需要记录能否从 `i` 跳到 `j` 即可，`dp[i][j]` 可以使用 `boolean` 来表示。

## 3. 代码实现

```java
class Solution {
    public boolean canCross(int[] stones) {
        int n = stones.length;
        if (stones[1] != 1) {
            return false;
        }
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            map.put(stones[i], i);
        }
        boolean[][] dp = new boolean[n][n];
        dp[0][1] = true;
        for (int j = 0; j < n; j++) {
            for (int i = 0; i <= j; i++) {
                if (dp[i][j]) {
                    int k = stones[j] - stones[i];
                    int next = stones[j] + k - 1;
                    if (map.containsKey(next)) {
                        dp[j][map.get(next)] = true;
                    }
                    next++;
                    if (map.containsKey(next)) {
                        dp[j][map.get(next)] = true;
                    }
                    next++;
                    if (map.containsKey(next)) {
                        dp[j][map.get(next)] = true;
                    }
                }
            }
        }
        // 可以在上面的 for 循环中判断是否到达终点
        // 但是我不想破坏上面整齐的结构
        for (int i = 0; i < n; i++) {
            if (dp[i][n - 1]) {
                return true;
            }
        }
        return false;
    }
}
```

## 4. 一点吐槽

这是青蛙唉，会游泳的，不管它跳不跳石头，它都能过河的撒。我觉得这道题的解就应该是：

```java
class Solution {
    public boolean canCross(int[] stones) {
        // 如果青蛙过不去，那就只能说是它不想过去
        return true;
    }
}
```
