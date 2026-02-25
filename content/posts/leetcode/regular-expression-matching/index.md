---
title: "LeetCode 10. 正则表达式匹配"
slug: regular-expression-matching
description:
date: 2024-03-18T22:12:04+08:00
draft: false
featuredImage:
math: false
hidden: false
categories:
  - leetcode
tags:
  - leetcode
  - oa
---

## 1. 题目介绍

原题链接：[10. 正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)，难度：**Hard**。

> 给你一个字符串  `s`  和一个字符规律  `p`，请你来实现一个支持  `'.'`  和  `'*'`  的正则表达式匹配。
>
> - `'.'`  匹配任意单个字符
> - `'*'`  匹配零个或多个前面的那一个元素
>
> 所谓匹配，是要涵盖  **整个**  字符串  `s`的，而不是部分字符串。

虽然是早期的 Hard，但是这道题的难度还是很高的，尤其以这道题的代码量来说。

## 2. 问题分析

首先需要分析问题的类型。如果说不存在 `'.'` 和 `'*'`，字符的话，那么只要 `equals()` 即可了。当然这道题不会这么善良。

首先引入 `'.'` 的概念，如果除了 `'.'` 之外的字符与位置都一致，那么也可以简单的判断是否能够匹配。

最后引入 `'*'` 的概念，它会将前一个的字符重复任意次数，也就是说，需要考虑前面的字符不会出现，以及出现多次，下述几种情况前面的字符串为 `s`，后面的为 `p`：

1. `acd` 和 `ab*cd`：`b` 出现 0 次，可以匹配
2. `abcd` 和 `ab*cd`：b 出现 1 次，可以匹配
3. `abcd` 和 `ab*bcd`：`b*` 实际没有使用，匹配的是 `p.charAt(3)` 的字符 `b`

需要记录类似例子 3 中 `b*` 能够匹配的 `s` 的位置，因此考虑这是个 dp 问题，需要记录截止到 `p` 的第 `j` 个字符为止，能够匹配 `s` 的第 `i` 个字符。

接下来考虑状态转移方程。对于没有 `'*'` 的世界来说，仅需要判断两种情况：

1. `s.charAt(i) == p.charAt(j)`
2. `p.chatAt(j) == '.'`
   显然状态转移方程为 `dp[i][j] = dp[i - 1][j - 1] & {上述两种情况}`。

复杂性同样在引入了 `'*'` 的世界里。还需要考虑以下三种情况：

1. 如果不使用 `'*'` 以及它前面的字符，那么存在 `dp[i][j] = dp[i - 1][j - 2]`
2. 如果使用 `'*'` 以及它前面的字符，则有：
   1. 当 `s.charAt(i) == p.charAt(j - 1)` 或者 `p.charAt(j - 1) == '.'` 时，即 `s` 的第 `i` 个字符与 `p` 的 `j - 1`（`'*'` 前的字符）一致时，`dp[i][j] = dp[i - 1][j]`，与 `dp[i - 1][j]` 比较的原因是，可以想象成 `dp[i - 1][j]` 中的 `'*'` 与其前置字符没有被使用
   2. 上述判断不成立，返回 `false`

为此，我们大概可以总结出了状态转移方程。

还需要考虑的特殊情况是，当 `s` 或者 `p` 为空串的场景，为了简化这种场景，我们初始化 `dp` 数组时，使用 `boolean[][] dp = new boolean[s.length() + 1][p.length() + 1]` 来初始化。考虑到 `p` 的第一个字符不会是 `'*'`，那么只要 `s` 为空串时，除了 `p` 也为空串的场景，都无法进行匹配。

## 3. 代码实现

```java
class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        // 因为使用 m + 1 与 n + 1 进行初始化，
        // 后续使用 .charAt 时，需要将 i j 减 1
        boolean[][] dp = new boolean[m + 1][n + 1];
        // 空串可以互相匹配
        dp[0][0] = true;
        for (int i = 0; i < m + 1; i++) {
            for (int j = 1; j < n + 1; j++) {
                // 先考虑没有 '*' 的世界
                if (p.charAt(j - 1) != '*') {
                    dp[i][j] = isMatch(s, i, p, j) ? dp[i - 1][j - 1] : false;
                } else {
                    // 引入 '*' 后，先考虑不使用 '*' 与前置字符
                    dp[i][j] = dp[i][j - 2];
                    // 如果 s.charAt(i - 1) == p.charAt(i - 2)
                    // 即当前遍历的 s 的字符，与 p 中 * 前的字符相同
                    if (isMatch(s, i, p, j - 1)) {
                        // 那么 s 直到 i - 1 与 p 直到 j - 1 能否匹配，
                        // 取决于 dp[i][j - 2] 与 dp[i - 1][j] 的结果
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                }
            }
        }
        return dp[m][n];
    }

    private boolean isMatch(String s, int si, String p, int pi) {
        if (si == 0) {
            return false;
        }
        if (p.charAt(pi - 1) == '.') {
            return true;
        }
        return s.charAt(si - 1) == p.charAt(pi - 1);
    }
}
```

## 4. 一些总结

这道题的难点我觉得有两个，第一个是想到动态规划的解法，我最开始想用回溯来做，发现需要考虑的场景很多，然后无情的看了答案；第二个是找出状态转移方程，需要考虑引入了 `*` 之后，是否使用 `*` 与前置字符，从而得出 `dp[i][j] = dp[i][j - 2] || dp[i - 1][j]` 这一步。想到这两点后，额外需要注意的就是考虑空串的情况了。

总觉得几个月后再看这道题，还是会忘......
