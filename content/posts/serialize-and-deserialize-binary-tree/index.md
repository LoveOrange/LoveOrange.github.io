---
title: "297. 二叉树的序列化与反序列化"
slug: serialize-and-deserialize-binary-tree
description:
date: 2024-03-13T21:02:09+08:00
draft: false
image:
math: false
hidden: false
categories:
  - leetcode
tags:
  - leetcode
  - oa
---

## 1. 题目介绍

原题链接：[297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)，难度：**Hard**。

> 序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。
>
> 请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。
>
> **提示:**  输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅  [LeetCode 序列化二叉树的格式](https://support.leetcode.cn/hc/kb/article/1567641/)。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。

作为计算机领域常用的技术，序列化与反序列化的方式有很多，如何更快的序列化，如何减少序列化后的体积，一直是很多人追求的目标。

本题只列举了一个场景，即二叉树的序列化与反序列化，实际中遇到更多的场景可能是将一个自定义结构的对象进行序列化，常见的如 RESTful 接口等，通常被序列化为 JSON 或者 XML 的格式。

这道题让我想起了之前公司的需求，对一整棵 Maven 依赖树进行序列化，然后存放在了 S3 上做 snapshot。不过实际环境里用到的方式要更粗暴一些，直接用的 ProtoBuf 将整棵树的对象序列化了......

## 2. 问题分析

简化一下，问题可以变为将一棵二叉树使用字符串的形式表示，第一反应应该就是前、中、后序表达式了。

联想到了构造二叉树的三兄弟：

1. [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
2. [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
3. [889. 根据前序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

对于这三道题目来说，知道任何两种遍历的方式后，可以反序列化成完整的二叉树。

那么对于这道题，是否也需要序列化成两种不同的序列，才能够反序列化成二叉树吗？其实不然。对于构造二叉树三兄弟来说，很重要的一点是找到左右子树的节点数量，进而找到叶子节点。但是对于本题，序列化的方式我们可以自己控制，我们可以自行在节点后添加 `null` 节点，来标识当前结点没有左子节点或右子节点。

因此我们可以尝试使用先序遍历的方式，对于序列化的过程：

1. 每遍历一个节点，则在序列化的字符串末尾添加 `{node.val},`
2. 如果节点为空，则添加 `N,`，具体的值可以根据喜好自行控制。等短的字符会节约空间

对于反序列化的过程：

1. 获取所有的节点值，通过截取分隔符 `,` 获得
2. 如果节点值为 `N`，表示当前结点为空
3. 按照先序遍历的顺序，先构造跟结点，再依次构造左子节点和右子节点
4. 一点优化，使用 `List<Integer>` 保存所有的节点值，每遍历一个节点就删除一个节点，可以避免记录当前遍历的顺序。而且在使用先序遍历的情况下，List 中的第一个值就是当前节点的值

## 3. 代码实现

```java file:Solution.java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        return doSerialize(root, "");
    }

    private String doSerialize(TreeNode root, String str) {
        if (root == null) {
            str += "N,";
            return str;
        }
        str += root.val + ",";
        str = doSerialize(root.left, str);
        str = doSerialize(root.right, str);
        return str;
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        String[] strs = data.split(",");
        return doDeserialize(new LinkedList<>(Arrays.asList(strs)));
    }

    private TreeNode doDeserialize(List<String> nodes) {
        if ("N".equals(nodes.get(0))) {
            nodes.remove(0);
            return null;
        }
        TreeNode root = new TreeNode(Integer.parseInt(nodes.get(0)));
        nodes.remove(0);
        root.left = doDeserialize(nodes);
        root.right = doDeserialize(nodes);
        return root;
    }
}

// Your Codec object will be instantiated and called as such:
// Codec ser = new Codec();
// Codec deser = new Codec();
// TreeNode ans = deser.deserialize(ser.serialize(root));
```

## 4. 相关题目

1. [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
2. [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
3. [889. 根据前序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

## 5. 一点额外的吐槽

这种解法的优势在于易于理解，但是运行的效率并不高，LeetCode 执行用时 61ms。看了一眼最快的解法，只能说很是离谱了。

好孩子不要学：

```java
class Codec {

    static TreeNode t;

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        t = root;
        return "";
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        return t;
    }
}
```
