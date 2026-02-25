---
title: "Leetcode 76. 最小覆盖子串"
slug: lc-76-minimum-window-substring
description:
date: 2024-03-12T21:53:01+08:00
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

原题链接：[76. 最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)

题目的描述很简单：

> 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

最小覆盖子串是很经典的面试题了，也是我 17 年面试微软的原题。

## 2. 问题分析

这是一个典型的滑动窗口问题，让我们来一步一步分析这道题。

题目中要求找到字符串 `s` 中涵盖字符串 `t` 的所有字符，那么首先需要统计字符串 `t` 中有多少字符，可以使用一个 `Map<Character, Integer> map` 来存储 `t` 中的字符以及出现的次数。

接下来就是滑动窗口的思路，设定滑动窗口的两端 `left` 和 `right`，使用 `Map<Character, Integer> window` 记录滑动窗口中的字符数量。

首先不断地向前移动右边界 `right`，直到 `left` 和 `right` 中的字符完全包含了 `map` 中的字符。

确定好右边界后，收缩左边界，同样地向前移动 `left`，直到 `left` 与 `right` 中的字符不再完全包含 `map` 中的字符，则左边界收缩结束。

可以使用 `start` 和 `end` 记录能够完全覆盖 `map` 中的字符时，`left` 与 `right` 的值。

判断 `left` 与 `right` 中的字符是否完全包含 `map` 中的值，可以直接比较两个 `Map<Character, Integer>`，也可以使用额外的变量记录符合条件的字符数量，优化判断的时间。

## 3. 代码实现

最终代码如下所示：

```java
class Solution {
    public String minWindow(String s, String t) {
        int n = s.length();
        Map<Character, Integer> map = new HashMap<>();
        for (char c : t.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }

        int left = 0, right = 0;
        int start = 0, end = Integer.MAX_VALUE;
        int valid = 0;

        Map<Character, Integer> window = new HashMap<>();
        while (right < n) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c) <= map.get(c)) {
                    valid++;
                }
            }
            // 因为在当前循环的末尾执行的 right++
            // 因此这里的判断条件需要包含等号
            while (left <= right && valid == t.length()) {
                if (right - left < end - start) {
                    start = left;
                    end = right;
                }
                char d = s.charAt(left);
                if (map.containsKey(d)) {
                    window.put(d, window.get(d) - 1);
                    if (window.get(d) < map.get(d)) {
                        valid--;
                    }
                }
                left++;
            }
            right++;
        }
        return end == Integer.MAX_VALUE ? "" : s.substring(start, end + 1);
    }
}
```

## 4. 相似题目

- [面试题 17.18. 最短超串](https://leetcode.cn/problems/shortest-supersequence-lcci/)
