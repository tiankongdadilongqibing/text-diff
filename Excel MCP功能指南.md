# Excel MCP 功能指南

本文档介绍 Excel MCP (Model Context Protocol) 提供的所有能力及其使用方法。

## 目录

- [功能概览](#功能概览)
- [详细功能说明](#详细功能说明)
- [使用示例](#使用示例)

---

## 功能概览

Excel MCP 提供了以下核心功能：

| 功能名称 | 描述 | 平台支持 |
|---------|------|---------|
| 读取工作表 | 分页读取 Excel 工作表中的数据 | 全平台 |
| 写入工作表 | 向 Excel 工作表写入数据 | 全平台 |
| 描述工作表 | 列出 Excel 文件中所有工作表信息 | 全平台 |
| 创建表格 | 在工作表中创建结构化表格 | 全平台 |
| 格式化单元格 | 设置单元格样式、边框、填充等 | 全平台 |
| 复制工作表 | 将现有工作表复制为新工作表 | 全平台 |
| 屏幕截图 | 截取工作表的屏幕截图 | 仅 Windows |

---

## 详细功能说明

### 1. 读取工作表 (excel_read_sheet)

**功能描述**: 分页读取 Excel 工作表中的值，支持显示公式和样式信息。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `sheetName` (必需): 工作表名称
- `range` (可选): 要读取的单元格范围，如 "A1:C10"。默认为第一个分页范围
- `showFormula` (可选): 是否显示公式而非值，默认 false
- `showStyle` (可选): 是否显示单元格样式信息，默认 false

**提示词示例**:
```
请读取文件 "C:\data\sales.xlsx" 中 "Sheet1" 工作表的 A1:D20 范围的数据
```

```
读取 "D:\reports\financial.xlsx" 的 "Summary" 工作表，显示公式而不是值
```

---

### 2. 写入工作表 (excel_write_to_sheet)

**功能描述**: 向 Excel 工作表写入数据，支持创建新工作表或写入现有工作表。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `sheetName` (必需): 工作表名称
- `newSheet` (必需): 是否创建新工作表，true 为创建新表，false 为写入现有表
- `range` (必需): 要写入的单元格范围，如 "A1:C10"
- `values` (必需): 要写入的值，二维数组格式。公式以 "=" 开头

**提示词示例**:
```
请在文件 "C:\data\report.xlsx" 的 "Sheet1" 工作表的 A1:C3 范围写入以下数据：
[["姓名", "年龄", "城市"],
 ["张三", 25, "北京"],
 ["李四", 30, "上海"]]
```

```
在 "D:\data\calc.xlsx" 中创建一个名为 "Analysis" 的新工作表，并在 A1:A3 写入公式：
[["=SUM(B1:B10)"], ["=AVERAGE(C1:C10)"], ["=MAX(D1:D10)"]]
```

---

### 3. 描述工作表 (excel_describe_sheets)

**功能描述**: 列出指定 Excel 文件中所有工作表的详细信息。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径

**提示词示例**:
```
请列出文件 "C:\data\workbook.xlsx" 中所有工作表的信息
```

```
查看 "D:\reports\annual_report.xlsx" 包含哪些工作表
```

---

### 4. 创建表格 (excel_create_table)

**功能描述**: 在 Excel 工作表中创建结构化表格。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `sheetName` (必需): 工作表名称
- `tableName` (必需): 要创建的表格名称
- `range` (可选): 表格范围，如 "A1:C10"

**提示词示例**:
```
请在文件 "C:\data\sales.xlsx" 的 "Sheet1" 工作表中，将 A1:D50 范围创建为名为 "SalesTable" 的表格
```

```
在 "D:\reports\data.xlsx" 的 "Employees" 工作表中创建一个名为 "EmployeeTable" 的表格，范围为 A1:F100
```

---

### 5. 格式化单元格 (excel_format_range)

**功能描述**: 格式化 Excel 工作表中的单元格，支持设置字体、边框、填充、数字格式等样式。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `sheetName` (必需): 工作表名称
- `range` (必需): 要格式化的单元格范围，如 "A1:C3"
- `styles` (必需): 二维数组，每个元素对应一个单元格的样式对象

**样式对象属性**:
- `font`: 字体样式
  - `bold`: 加粗 (boolean)
  - `italic`: 斜体 (boolean)
  - `size`: 字号 (number, 1-409)
  - `color`: 颜色 (string, 十六进制格式如 "#FF0000")
  - `underline`: 下划线 ("none" | "single" | "double" | "singleAccounting" | "doubleAccounting")
  - `strike`: 删除线 (boolean)
  - `vertAlign`: 垂直对齐 ("baseline" | "superscript" | "subscript")
- `fill`: 填充样式
  - `type`: 填充类型 ("gradient" | "pattern")
  - `pattern`: 图案样式 ("solid" | "mediumGray" | "darkGray" 等)
  - `color`: 颜色数组 (十六进制格式)
  - `shading`: 阴影方向 ("horizontal" | "vertical" | "diagonalDown" 等)
- `border`: 边框数组
  - `type`: 边框位置 ("left" | "right" | "top" | "bottom" | "diagonalDown" | "diagonalUp")
  - `style`: 边框样式 ("none" | "continuous" | "dash" | "dot" | "double" 等)
  - `color`: 边框颜色 (十六进制格式)
- `numFmt`: 自定义数字格式字符串
- `decimalPlaces`: 小数位数 (number, 0-30)

**提示词示例**:
```
请将文件 "C:\data\report.xlsx" 的 "Sheet1" 工作表中 A1:D1 范围的单元格设置为：
- 加粗
- 字体大小 14
- 背景色为浅蓝色 (#ADD8E6)
- 底部边框为双线
```

```
格式化 "D:\data\financial.xlsx" 的 "Summary" 工作表：
- A1:A10 设置为货币格式，保留2位小数
- B1:B10 设置红色字体，加粗
- C1:C10 设置黄色背景
```

---

### 6. 复制工作表 (excel_copy_sheet)

**功能描述**: 将现有工作表复制为新的工作表。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `srcSheetName` (必需): 源工作表名称
- `dstSheetName` (必需): 目标工作表名称（复制后的新名称）

**提示词示例**:
```
请将文件 "C:\data\template.xlsx" 中的 "Template" 工作表复制为 "Backup_2024"
```

```
在 "D:\reports\monthly.xlsx" 中，将 "January" 工作表复制一份，命名为 "January_Copy"
```

---

### 7. 屏幕截图 (excel_screen_capture) - 仅限 Windows

**功能描述**: 截取 Excel 工作表的屏幕截图，支持分页截图。

**参数**:
- `fileAbsolutePath` (必需): Excel 文件的绝对路径
- `sheetName` (必需): 工作表名称
- `range` (可选): 要截图的单元格范围，默认为第一个分页范围

**提示词示例**:
```
请截取文件 "C:\data\chart.xlsx" 中 "Dashboard" 工作表的屏幕截图
```

```
对 "D:\reports\summary.xlsx" 的 "Sheet1" 工作表的 A1:G30 范围进行截图
```

---

## 使用示例

### 示例 1: 创建并格式化销售报表

```
1. 请在 "C:\reports\sales_2024.xlsx" 中创建一个名为 "Q1_Sales" 的新工作表
2. 在 A1:D5 范围写入以下数据：
   [["产品", "销量", "单价", "总额"],
    ["产品A", 100, 50, "=B2*C2"],
    ["产品B", 150, 60, "=B3*C3"],
    ["产品C", 200, 45, "=B4*C4"],
    ["合计", "=SUM(B2:B4)", "", "=SUM(D2:D4)"]]
3. 将 A1:D1 设置为表头样式：加粗、字号12、背景色 #4472C4、白色字体
4. 将 A1:D5 创建为名为 "SalesTable" 的表格
```

### 示例 2: 数据分析和格式化

```
1. 读取 "D:\data\raw_data.xlsx" 的 "Data" 工作表中的所有数据
2. 在同一文件中创建新工作表 "Analysis"
3. 写入分析结果到新工作表
4. 格式化数字列，设置货币格式和千位分隔符
5. 为关键数据添加条件格式（如负数显示红色）
```

### 示例 3: 批量处理多个工作表

```
1. 列出 "C:\data\workbook.xlsx" 中的所有工作表
2. 读取每个工作表的数据
3. 将所有数据合并到一个新工作表 "Combined"
4. 创建汇总表格并格式化
```

---

## 最佳实践

1. **文件路径**: 始终使用绝对路径，确保文件存在且有访问权限
2. **范围指定**: 明确指定单元格范围，避免读取过多数据
3. **错误处理**: 操作前先检查工作表是否存在
4. **性能优化**: 大量数据操作时，分批进行
5. **样式一致性**: 格式化时保持样式风格统一

---

## 注意事项

- 屏幕截图功能仅在 Windows 平台可用
- 写入公式时必须以 "=" 开头
- 颜色值必须使用十六进制格式（如 "#FF0000"）
- 创建表格前确保范围内已有数据
- 复制工作表时，目标工作表名称不能与现有工作表重名

---

## 常见问题

**Q: 如何处理大型 Excel 文件？**
A: 使用分页读取，指定合理的 range 参数，避免一次性读取过多数据。

**Q: 公式不生效怎么办？**
A: 确保公式语法正确，且引用的单元格存在。写入后打开 Excel 文件检查公式。

**Q: 如何设置复杂的条件格式？**
A: Excel MCP 目前支持基础格式化，复杂条件格式可能需要结合 Excel 的内置功能。

**Q: 支持哪些 Excel 文件格式？**
A: 支持 .xlsx 和 .xlsm 格式（Excel 2007 及更高版本）。

---

## 相关资源

- [Excel MCP 官方文档](https://github.com/modelcontextprotocol/servers/tree/main/src/excel)
- [Excel JavaScript API 文档](https://docs.microsoft.com/en-us/javascript/api/excel)
