---
title: 'LeetCode 239. 滑动窗口最大值'
slug: sliding-window-maximum
description:
date: 2024-03-13T09:46:47+08:00
draft: false
image:
math: false
hidden: false
categories:
  - leetcode
tags:
  - leetcode
  - oa
  - sliding-window
  - priority-queue
---

## 1. 题目介绍

原题链接：[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)，难度：**Hard**。

> 给你一个整数数组 `nums`，有一个大小为 `k` 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 `k` 个数字。滑动窗口每次只向右移动一位。
>
> 返回 _滑动窗口中的最大值_ 。

## 2. 问题分析

因为滑动窗口的长度为 `k`，所以最终返回的结果是一个长度为 `nums.length - k + 1` 的数组。如果这是大学期末考试题的话，写到这里至少应该能得两分。

接下来想办法获取每 `k` 个长度内的最大值。假设我们已经维护了 `[i, i + k)` 个数字的数组 `arr`，并且按照从大到小的顺序排序了。那么当索引移动到 `i + 1` 时，我们需要做的就是将数组 `arr` 中，按照从大到小的顺序，移除不在索引 `[i + 1， i + k + 1)` 的数字，那么此时数组的头部元素即是当前段的最大值。

考虑到数组中的数字允许重复，如果在 `[i, i + k)` 段中，有两个最大值，那么我们优先考虑使用后面的索引，因为它更有可能在下一段中也是最大值。因此在数组 `arr` 中，除了要维护 `[i, i + k)` 的值外，还需要将它们对应的索引也维护起来，并且按照值大小、索引位置进行排序。

为了简化排序流程，可以考虑使用「优先队列」的数据结构。初始化如下的优先队列，队列的每一个元素是一个数组，值为 `{ nums[i], i }`。

```java
PriorityQueue<int[]> pq = new PriorityQueue<>((ar1, ar2)
        -> ar1[0] == ar2[0] ? ar2[1] - ar1[1] : ar2[0] - ar1[0]);
```

## 3. 代码实现

最终代码如下所示：

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        PriorityQueue<int[]> pq = new PriorityQueue<>((ar1, ar2)
            -> ar1[0] == ar2[0] ? ar2[1] - ar1[1] : ar2[0] - ar1[0]);
        for (int i = 0; i < k; i++) {
            pq.offer(new int[]{ nums[i], i });
        }
        int[] res = new int[n - k + 1];
        res[0] = pq.peek()[0];
        for (int i = k; i < n; i++) {
            pq.offer(new int[]{ nums[i], i });
            while (pq.peek()[1] <= i - k) {
                pq.poll();
            }
            res[i - k + 1] = pq.peek()[0];
        }
        return res;
    }
}
```

此代码的速度并不快，LeetCode 执行时将约为 86 ms。推测为优先队列本身的排序比较耗时。可以考虑使用单调栈的方式对选取 `[i, i + k)` 中最大值的部分进行优化。